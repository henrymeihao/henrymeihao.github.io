-- Comments for https://henrymeihao.github.io: the about-page guestbook (page '/about/') and one thread per article (page '/writing/<slug>/').
-- Run once in the Supabase SQL editor on an empty project. Visitors can read visible comments and post only through post_comment().

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Random salt so stored IP hashes cannot be reversed by hashing every IPv4 address.
create table private.comment_salt (salt text not null);
insert into private.comment_salt values (gen_random_uuid()::text);

create table public.comments (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  page text not null check (page ~ '^/(about|writing/[a-z0-9-]+)/$'),
  display_name text not null check (char_length(display_name) between 1 and 24),
  content text not null check (char_length(content) between 1 and 500),
  ip_hash text not null,
  hidden boolean not null default false  -- set to true in the Table Editor to hide a comment
);
create index comments_page_created_at on public.comments (page, created_at desc);

alter table public.comments enable row level security;
revoke all on public.comments from public, anon, authenticated;
grant select (id, created_at, page, display_name, content) on public.comments to anon, authenticated;
create policy "visible comments are public" on public.comments
  for select to anon, authenticated using (not hidden);

create function public.post_comment(p_page text, p_name text, p_content text)
returns table (id bigint, created_at timestamptz, display_name text, content text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text := left(btrim(coalesce(p_name, '')), 24);
  v_content text := btrim(coalesce(p_content, ''));
  v_headers json := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::json;
  v_ip text := coalesce(v_headers->>'cf-connecting-ip', nullif(split_part(v_headers->>'x-forwarded-for', ',', 1), ''), 'unknown');
  v_hash text;
begin
  if coalesce(p_page, '') !~ '^/(about|writing/[a-z0-9-]+)/$' then raise exception 'bad_page'; end if;
  if v_content = '' then raise exception 'empty'; end if;
  if char_length(v_content) > 500 then raise exception 'too_long'; end if;
  if v_name = '' then v_name := '路过的朋友'; end if;

  select encode(extensions.digest(v_ip || s.salt, 'sha256'), 'hex') into v_hash from private.comment_salt s limit 1;

  -- Limits apply across the whole site, not per page.
  if (select count(*) from public.comments c
      where c.ip_hash = v_hash and c.created_at > now() - interval '10 minutes') >= 5 then
    raise exception 'rate_limited';
  end if;
  if (select count(*) from public.comments c
      where c.created_at > now() - interval '1 minute') >= 20 then
    raise exception 'busy';
  end if;

  return query
    insert into public.comments (page, display_name, content, ip_hash)
    values (p_page, v_name, v_content, v_hash)
    returning comments.id, comments.created_at, comments.display_name, comments.content;
end;
$$;

revoke all on function public.post_comment(text, text, text) from public, anon, authenticated;
grant execute on function public.post_comment(text, text, text) to anon, authenticated;
