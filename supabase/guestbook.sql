-- Guestbook for https://henrymeihao.github.io/about/#guestbook
-- Run once in the Supabase SQL editor. Visitors can read visible messages and post only through post_guestbook_message().

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Random salt so stored IP hashes cannot be reversed by hashing every IPv4 address.
create table private.guestbook_salt (salt text not null);
insert into private.guestbook_salt values (gen_random_uuid()::text);

create table public.guestbook_messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  display_name text not null check (char_length(display_name) between 1 and 24),
  content text not null check (char_length(content) between 1 and 500),
  ip_hash text not null,
  hidden boolean not null default false  -- set to true in the Table Editor to hide a message
);
create index guestbook_messages_created_at on public.guestbook_messages (created_at desc);

alter table public.guestbook_messages enable row level security;
revoke all on public.guestbook_messages from public, anon, authenticated;
grant select (id, created_at, display_name, content) on public.guestbook_messages to anon, authenticated;
create policy "visible messages are public" on public.guestbook_messages
  for select to anon, authenticated using (not hidden);

create function public.post_guestbook_message(p_name text, p_content text)
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
  if v_content = '' then raise exception 'empty'; end if;
  if char_length(v_content) > 500 then raise exception 'too_long'; end if;
  if v_name = '' then v_name := '路过的朋友'; end if;

  select encode(extensions.digest(v_ip || s.salt, 'sha256'), 'hex') into v_hash from private.guestbook_salt s limit 1;

  if (select count(*) from public.guestbook_messages g
      where g.ip_hash = v_hash and g.created_at > now() - interval '10 minutes') >= 3 then
    raise exception 'rate_limited';
  end if;
  if (select count(*) from public.guestbook_messages g
      where g.created_at > now() - interval '1 minute') >= 20 then
    raise exception 'busy';
  end if;

  return query
    insert into public.guestbook_messages (display_name, content, ip_hash)
    values (v_name, v_content, v_hash)
    returning guestbook_messages.id, guestbook_messages.created_at, guestbook_messages.display_name, guestbook_messages.content;
end;
$$;

revoke all on function public.post_guestbook_message(text, text) from public, anon, authenticated;
grant execute on function public.post_guestbook_message(text, text) to anon, authenticated;
