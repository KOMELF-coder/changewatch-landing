-- Apply as the database owner in Supabase SQL Editor. See docs/blog-comments/README.md.
-- No data deletion or status conversion; incompatible existing rows abort the transaction.
begin;

do $migration$
begin
  if exists (select 1 from public.comments where status is null or status not in ('pending','approved','rejected')) then
    raise exception 'Existing comment statuses need owner review; no changes applied';
  end if;
  if not exists (select 1 from pg_catalog.pg_roles where rolname = 'cw_comments_rpc') then
    create role cw_comments_rpc nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
  end if;
  if exists (select 1 from pg_catalog.pg_roles where rolname = 'cw_comments_rpc'
             and (rolcanlogin or rolsuper or rolbypassrls or rolcreaterole or rolcreatedb or rolreplication))
     or exists (select 1 from pg_catalog.pg_auth_members m join pg_catalog.pg_roles r
                on r.oid = m.member where r.rolname = 'cw_comments_rpc')
     or exists (select 1 from pg_catalog.pg_auth_members m
                join pg_catalog.pg_roles r on r.oid = m.roleid
                join pg_catalog.pg_roles member_role on member_role.oid = m.member
                where r.rolname = 'cw_comments_rpc' and member_role.rolname <> current_user) then
    raise exception 'Unexpected cw_comments_rpc role privileges or membership; owner review required';
  end if;
  if exists (select 1 from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
             where n.nspname='public' and
             ((p.proname='get_approved_comments' and p.proargtypes <> '25'::pg_catalog.oidvector)
              or (p.proname='submit_blog_comment' and p.proargtypes <> '25 25 25 25 25'::pg_catalog.oidvector))) then
    raise exception 'Unexpected RPC overload; owner review required';
  end if;
end
$migration$;

-- The installer is already the trusted table owner. This membership permits ownership
-- transfer by Supabase's non-superuser postgres role; never grant it to API roles.
grant cw_comments_rpc to current_user;

alter table public.comments enable row level security;
alter table public.comments alter column status set default 'pending';
alter table public.comments alter column status set not null;
alter table public.comments drop constraint if exists cw_comments_status_check;
alter table public.comments add constraint cw_comments_status_check check (status in ('pending','approved','rejected'));

-- Grants, including column grants, are what make a table available to the Data API.
-- Existing anon/public policies cannot grant access once table privileges are revoked.
revoke all privileges on table public.comments from public, anon, authenticated;
revoke all privileges on table public.comments from cw_comments_rpc;
grant usage on schema public to cw_comments_rpc;
grant select (id, article_slug, name, comment, status, created_at) on public.comments to cw_comments_rpc;
grant insert (article_slug, name, email, comment, status) on public.comments to cw_comments_rpc;

-- The migration alone uses quoted catalog identifiers. Neither callable RPC uses dynamic SQL.
do $migration$
declare seq text;
begin
  seq := pg_catalog.pg_get_serial_sequence('public.comments','id');
  if seq is null then raise exception 'comments.id must have an identity or sequence default'; end if;
  execute pg_catalog.format('revoke all privileges on sequence %s from public, anon, authenticated', seq);
  execute pg_catalog.format('grant usage on sequence %s to cw_comments_rpc', seq);
end
$migration$;

drop policy if exists cw_comments_rpc_read on public.comments;
create policy cw_comments_rpc_read on public.comments for select to cw_comments_rpc using (status = 'approved');
drop policy if exists cw_comments_rpc_insert on public.comments;
create policy cw_comments_rpc_insert on public.comments for insert to cw_comments_rpc with check (status = 'pending');

create or replace function public.get_approved_comments(p_article_slug text)
returns table (id bigint, article_slug text, name text, comment text, created_at timestamptz)
language plpgsql stable security definer set search_path = ''
as $function$
begin
  if p_article_slug is null or pg_catalog.char_length(p_article_slug) > 120
     or p_article_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
    raise exception using errcode = '22023', message = 'Invalid article';
  end if;
  return query
    select c.id, c.article_slug, c.name, c.comment, c.created_at
    from public.comments c
    where c.status = 'approved' and c.article_slug = p_article_slug
    order by c.created_at asc, c.id asc;
end
$function$;

create or replace function public.submit_blog_comment(
  p_article_slug text, p_name text, p_email text, p_comment text, p_website text default null
)
returns void
language plpgsql security definer set search_path = ''
as $function$
declare
  clean_name text;
  clean_email text;
  clean_comment text;
begin
  -- Bound raw inputs before normalization; the browser is not a trust boundary.
  if p_article_slug is null or pg_catalog.char_length(p_article_slug) > 120
     or p_article_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
     or p_name is null or pg_catalog.char_length(p_name) > 500
     or p_email is null or pg_catalog.char_length(p_email) > 500
     or p_comment is null or pg_catalog.char_length(p_comment) > 4000
     or coalesce(p_website, '') ~ '[^[:space:]]' then
    raise exception using errcode = '22023', message = 'Invalid comment';
  end if;
  clean_name := pg_catalog.btrim(pg_catalog.regexp_replace(p_name, '[[:space:]]+', ' ', 'g'));
  clean_email := pg_catalog.regexp_replace(p_email, '^[[:space:]]+|[[:space:]]+$', '', 'g');
  clean_comment := pg_catalog.regexp_replace(p_comment, '^[[:space:]]+|[[:space:]]+$', '', 'g');
  if pg_catalog.char_length(clean_name) not between 2 and 80
     or pg_catalog.char_length(clean_email) not between 3 and 254
     or clean_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
     or pg_catalog.char_length(clean_comment) not between 3 and 3000 then
    raise exception using errcode = '22023', message = 'Invalid comment';
  end if;
  insert into public.comments (article_slug, name, email, comment, status)
  values (p_article_slug, clean_name, clean_email, clean_comment, 'pending');
  -- Return neither the record nor its private fields. No caller-controlled status argument.
end
$function$;

-- Transfer ownership to a restricted role (not the database/table owner).
grant create on schema public to cw_comments_rpc;
alter function public.get_approved_comments(text) owner to cw_comments_rpc;
alter function public.submit_blog_comment(text,text,text,text,text) owner to cw_comments_rpc;
revoke create on schema public from cw_comments_rpc;
revoke all on function public.get_approved_comments(text) from public, anon, authenticated;
revoke all on function public.submit_blog_comment(text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.get_approved_comments(text) to anon;
grant execute on function public.submit_blog_comment(text,text,text,text,text) to anon;

create index if not exists cw_comments_approved_article_date
  on public.comments (article_slug, created_at, id) where status = 'approved';

-- Fail closed if inherited grants or a nonstandard environment retain direct access.
do $migration$
declare r text;
begin
  foreach r in array array['anon','authenticated'] loop
    if pg_catalog.has_table_privilege(r, 'public.comments', 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')
       or pg_catalog.has_any_column_privilege(r, 'public.comments', 'SELECT,INSERT,UPDATE,REFERENCES') then
      raise exception 'Direct comments privileges remain for %; inspect inherited grants', r;
    end if;
  end loop;
  if pg_catalog.has_column_privilege('cw_comments_rpc','public.comments','email','SELECT') then
    raise exception 'RPC role must not be able to read email';
  end if;
end
$migration$;
notify pgrst, 'reload schema';
commit;
