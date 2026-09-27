-- Emergency disable after an applied migration. Keep email/table protection in place.
-- Restore the prior frontend commit separately. Do not restore public table grants.
begin;
revoke execute on function public.get_approved_comments(text) from public,anon,authenticated;
revoke execute on function public.submit_blog_comment(text,text,text,text,text) from public,anon,authenticated;
notify pgrst, 'reload schema';
commit;
