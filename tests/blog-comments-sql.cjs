// Local PostgreSQL (PGlite) only. No production credentials, network or writes to Supabase.
const {PGlite}=require(process.env.PGLITE_MODULE||'@electric-sql/pglite');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const migration=fs.readFileSync(path.join(__dirname,'../supabase/migrations/20260924170000_blog_comments.sql'),'utf8');
const bootstrap=`create role anon nologin; create role authenticated nologin; create role unrelated nologin;
grant usage on schema public to anon, authenticated, unrelated;
create table public.comments(id bigint generated always as identity primary key,article_slug text,name text,email text,comment text,status text default 'pending',created_at timestamptz default now());
alter table public.comments enable row level security;
grant all on public.comments to anon,authenticated; grant select(email) on public.comments to anon; grant usage on sequence comments_id_seq to anon;
create policy legacy_read on public.comments for select to public using(status='approved');
create policy legacy_insert on public.comments for insert to public with check(status='pending');`;
const call='select public.submit_blog_comment($1,$2,$3,$4,$5)';
async function denied(db,sql,params=[],code='42501'){await assert.rejects(db.query(sql,params),e=>e.code===code)}
(async()=>{const db=new PGlite();try{
 await db.exec(bootstrap);
 await db.exec("insert into comments(article_slug,name,email,comment,status,created_at) values ('veille-concurrentielle-exemple','Later','later@example.test','Later public','approved','2026-09-24'),('veille-concurrentielle-exemple','Earlier','earlier@example.test','Earlier public','approved','2026-09-23'),('veille-concurrentielle-exemple','Private','private@example.test','Hidden pending','pending',now()),('veille-concurrentielle-exemple','Rejected','reject@example.test','Hidden rejected','rejected',now()),('price-tracking-software','Other','other@example.test','Other article','approved',now());");
 await db.exec(migration);await db.exec(migration); // Safe repeat, no duplicated policy or data.
 const version=(await db.query('select version()')).rows[0].version;
 for(const role of ['anon','authenticated']){
  await db.exec('set role '+role);
  await denied(db,'select email from public.comments');await denied(db,'select name from public.comments');
  await denied(db,"insert into public.comments(article_slug,name,email,comment,status) values('abc','Bot','bot@example.test','Text','pending')");
  await denied(db,"update public.comments set status='approved'");await denied(db,'delete from public.comments');
  await denied(db,"select nextval('public.comments_id_seq')");
  if(role==='authenticated')await denied(db,"select * from public.get_approved_comments('veille-concurrentielle-exemple')");
  await db.exec('reset role');
 }
 await db.exec('set role unrelated');await denied(db,"select * from public.get_approved_comments('veille-concurrentielle-exemple')");await denied(db,call,['abc','Name','x@example.test','Text',null]);await db.exec('reset role');
 await db.exec('set role anon');
 const visible=await db.query("select * from public.get_approved_comments('veille-concurrentielle-exemple')");
 assert.deepEqual(visible.rows.map(x=>x.name),['Earlier','Later']);assert.deepEqual(Object.keys(visible.rows[0]),['id','article_slug','name','comment','created_at']);
 assert.ok(!JSON.stringify(visible.rows).includes('@'));assert.equal((await db.query("select * from public.get_approved_comments('no-comments')")).rows.length,0);
 await denied(db,"select * from public.get_approved_comments('../private')",[],'22023');
 const valid=['veille-concurrentielle-exemple','  Jane\n  Doe  ',' jane@example.test ','  <script>alert(1)</script>\nPlain text  ',null];
 const result=await db.query(call,valid);assert.deepEqual(Object.keys(result.rows[0]),['submit_blog_comment']);
 const invalid=[[null,'Jane','j@example.test','Text',null],['../oops','Jane','j@example.test','Text',null],['a'.repeat(121),'Jane','j@example.test','Text',null],['abc',null,'j@example.test','Text',null],['abc',' ','j@example.test','Text',null],['abc','x'.repeat(81),'j@example.test','Text',null],['abc','Jane','not-email','Text',null],['abc','Jane','a'.repeat(249)+'@x.test','Text',null],['abc','Jane','j@example.test','  x ',null],['abc','Jane','j@example.test','x'.repeat(3001),null],['abc','Jane','j@example.test','Text','bot.example'],['abc','Jane','j@example.test',null,null]];
 for(const args of invalid)await denied(db,call,args,'22023');
 await denied(db,"select public.submit_blog_comment(p_article_slug=>'abc',p_name=>'Jane',p_email=>'j@example.test',p_comment=>'Text',status=>'approved')",[],'42883');
 assert.equal((await db.query("select * from public.get_approved_comments('veille-concurrentielle-exemple')")).rows.length,2);
 await db.exec('reset role');
 const pending=(await db.query("select name,email,comment,status from comments where name='Jane Doe'")).rows;
 assert.equal(pending.length,1);assert.deepEqual(pending[0],{name:'Jane Doe',email:'jane@example.test',comment:'<script>alert(1)</script>\nPlain text',status:'pending'});
 await assert.rejects(db.query("update comments set status='arbitrary'"),e=>e.code==='23514');
 const owner=(await db.query("select p.prosecdef,p.proconfig,r.rolname from pg_proc p join pg_roles r on r.oid=p.proowner where proname in ('get_approved_comments','submit_blog_comment')")).rows;
 assert.equal(owner.length,2);for(const row of owner){assert.equal(row.rolname,'cw_comments_rpc');assert.ok(row.prosecdef);assert.ok(row.proconfig.some(x=>x==='search_path=""'));}
 assert.equal((await db.query("select has_column_privilege('cw_comments_rpc','public.comments','email','SELECT') as access")).rows[0].access,false);
 await db.exec("update comments set status='approved' where name='Jane Doe'; set role anon");assert.equal((await db.query("select * from public.get_approved_comments('veille-concurrentielle-exemple')")).rows.length,3);await db.exec('reset role');
 await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/verify_blog_comments.sql'),'utf8'));
 await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/disable_blog_comments.sql'),'utf8'));
 await db.exec('set role anon');await denied(db,"select * from public.get_approved_comments('abc')");await denied(db,call,['abc','Name','a@example.test','Text',null]);await denied(db,'select email from public.comments');await db.exec('reset role');
 console.log('PASS SQL: migration/repeat, role/table/column/sequence denial, public RPC projection/order/isolation, pending forced, validation/honeypot, approval, status constraint, restricted owner/search_path, verification and secure disable. '+version);
}finally{await db.close()}
const bad=new PGlite();try{await bad.exec(bootstrap);await bad.exec("insert into comments(status) values('unknown')");await assert.rejects(bad.exec(migration),/Existing comment statuses/);await bad.exec('rollback');assert.equal((await bad.query("select status from comments")).rows[0].status,'unknown');console.log('PASS incompatible legacy status aborts migration without rewriting data');}finally{await bad.close()}
const restricted=new PGlite();try{
 await restricted.exec('create role installer login createrole; grant usage,create on schema public to installer with grant option; set role installer;');
 await restricted.exec(bootstrap);await restricted.exec(migration);await restricted.exec(migration);
 await restricted.query(call,['abc','Name','a@example.test','A comment',null]);
 assert.equal((await restricted.query('select status from comments')).rows[0].status,'pending');
 console.log('PASS migration under non-superuser table owner with CREATEROLE, repeated install and RPC insertion');
}finally{await restricted.close()}
})().catch(e=>{console.error(e.message);process.exitCode=1});
