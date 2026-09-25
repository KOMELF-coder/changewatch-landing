-- READ ONLY. Run after the migration, as the same trusted database owner.
-- No test comments or personal data are inserted or selected.
begin;
do $verify$
declare r text;
begin
  if not (select relrowsecurity from pg_catalog.pg_class where oid='public.comments'::regclass) then
    raise exception 'RLS is not enabled';
  end if;
  foreach r in array array['anon','authenticated'] loop
    if pg_catalog.has_table_privilege(r,'public.comments','SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')
       or pg_catalog.has_any_column_privilege(r,'public.comments','SELECT,INSERT,UPDATE,REFERENCES') then
      raise exception 'Direct table/column access remains for %',r;
    end if;
  end loop;
  if not pg_catalog.has_function_privilege('anon','public.get_approved_comments(text)','EXECUTE')
     or not pg_catalog.has_function_privilege('anon','public.submit_blog_comment(text,text,text,text,text)','EXECUTE')
     or pg_catalog.has_function_privilege('authenticated','public.get_approved_comments(text)','EXECUTE')
     or pg_catalog.has_function_privilege('authenticated','public.submit_blog_comment(text,text,text,text,text)','EXECUTE') then
    raise exception 'Unexpected RPC permissions';
  end if;
  if pg_catalog.has_column_privilege('cw_comments_rpc','public.comments','email','SELECT') then
    raise exception 'RPC role can read email';
  end if;
  if exists (select 1 from pg_catalog.pg_proc p
             where p.oid in ('public.get_approved_comments(text)'::regprocedure,
                             'public.submit_blog_comment(text,text,text,text,text)'::regprocedure)
               and (not p.prosecdef or not coalesce('search_path=""'=any(p.proconfig), false)
                    or p.proowner <> (select oid from pg_catalog.pg_roles where rolname='cw_comments_rpc'))) then
    raise exception 'Unexpected function owner or search_path';
  end if;
end
$verify$;
select p.proname, pg_catalog.pg_get_function_result(p.oid) as result_shape,
       p.prosecdef as security_definer, p.proconfig as function_settings
from pg_catalog.pg_proc p
where p.oid in ('public.get_approved_comments(text)'::regprocedure,
               'public.submit_blog_comment(text,text,text,text,text)'::regprocedure);
-- Confirm invocation under the actual public role; limit 0 returns no comment data.
set local role anon;
select id,article_slug,name,comment,created_at
from public.get_approved_comments('veille-concurrentielle-exemple') limit 0;
rollback;
