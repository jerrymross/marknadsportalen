create extension if not exists "pgcrypto";

create type user_role as enum ('beställare', 'admin');
create type ticket_priority as enum ('låg', 'normal', 'hög', 'akut');
create type ticket_status as enum (
  'Inskickat',
  'Mottaget',
  'Behöver mer information',
  'Planerat',
  'Pågår',
  'Korrektur',
  'Väntar på godkännande',
  'Klart',
  'Avslutat'
);

create sequence if not exists ticket_number_seq;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  department text,
  role user_role not null default 'beställare',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text unique not null,
  title text not null,
  requester_id uuid references public.profiles(id) on delete set null,
  requester_name text not null,
  requester_email text not null,
  department text not null,
  category text not null check (category in (
    'Grafisk produktion',
    'Sociala medier',
    'Trycksak',
    'Webb',
    'Kod/utveckling',
    'Foto/video',
    'Text/copy',
    'Annat'
  )),
  description text not null,
  goal text,
  target_audience text,
  usage_channel text,
  deadline date,
  priority ticket_priority not null default 'normal',
  status ticket_status not null default 'Inskickat',
  eta date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  body text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.files (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.status_history (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  old_status ticket_status,
  new_status ticket_status not null,
  changed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.assign_ticket_number()
returns trigger
language plpgsql
as $$
begin
  if new.ticket_number is null or new.ticket_number = '' then
    new.ticket_number :=
      'MKT-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('ticket_number_seq')::text, 3, '0');
  end if;
  return new;
end;
$$;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, department, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'department',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'beställare')
  );
  return new;
end;
$$;

create or replace function public.record_ticket_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.status_history (ticket_id, old_status, new_status, changed_by)
    values (new.id, null, new.status, auth.uid());
  elsif old.status is distinct from new.status then
    insert into public.status_history (ticket_id, old_status, new_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create or replace function public.touch_ticket()
returns trigger
language plpgsql
as $$
begin
  update public.tickets
  set updated_at = now()
  where id = new.ticket_id;
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger tickets_ticket_number
before insert on public.tickets
for each row execute function public.assign_ticket_number();

create trigger tickets_updated_at
before update on public.tickets
for each row execute function public.set_updated_at();

create trigger tickets_status_history
after insert or update of status on public.tickets
for each row execute function public.record_ticket_status();

create trigger comments_touch_ticket
after insert on public.comments
for each row execute function public.touch_ticket();

create trigger files_touch_ticket
after insert on public.files
for each row execute function public.touch_ticket();

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

alter table public.profiles enable row level security;
alter table public.tickets enable row level security;
alter table public.comments enable row level security;
alter table public.files enable row level security;
alter table public.status_history enable row level security;

create policy "profiles_select_own_or_admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid() and role = 'beställare');

create policy "tickets_select_own_or_admin"
on public.tickets for select
using (
  requester_id = auth.uid()
  or requester_email = auth.jwt()->>'email'
  or public.is_admin()
);

create policy "tickets_insert_authenticated"
on public.tickets for insert
with check (auth.role() = 'authenticated' and requester_id = auth.uid());

create policy "tickets_update_admin"
on public.tickets for update
using (public.is_admin())
with check (public.is_admin());

create policy "tickets_requester_can_close"
on public.tickets for update
using (requester_id = auth.uid())
with check (requester_id = auth.uid() and status = 'Avslutat');

create policy "comments_select_visible"
on public.comments for select
using (
  public.is_admin()
  or (
    is_internal = false
    and exists (
      select 1 from public.tickets
      where tickets.id = comments.ticket_id
        and (tickets.requester_id = auth.uid() or tickets.requester_email = auth.jwt()->>'email')
    )
  )
);

create policy "comments_insert_visible_or_admin"
on public.comments for insert
with check (
  user_id = auth.uid()
  and (
    public.is_admin()
    or (
      is_internal = false
      and exists (
        select 1 from public.tickets
        where tickets.id = comments.ticket_id
          and (tickets.requester_id = auth.uid() or tickets.requester_email = auth.jwt()->>'email')
      )
    )
  )
);

create policy "files_select_ticket_access"
on public.files for select
using (
  public.is_admin()
  or exists (
    select 1 from public.tickets
    where tickets.id = files.ticket_id
      and (tickets.requester_id = auth.uid() or tickets.requester_email = auth.jwt()->>'email')
  )
);

create policy "files_insert_ticket_access"
on public.files for insert
with check (
  uploaded_by = auth.uid()
  and (
    public.is_admin()
    or exists (
      select 1 from public.tickets
      where tickets.id = files.ticket_id
        and (tickets.requester_id = auth.uid() or tickets.requester_email = auth.jwt()->>'email')
    )
  )
);

create policy "status_history_select_ticket_access"
on public.status_history for select
using (
  public.is_admin()
  or exists (
    select 1 from public.tickets
    where tickets.id = status_history.ticket_id
      and (tickets.requester_id = auth.uid() or tickets.requester_email = auth.jwt()->>'email')
  )
);

insert into storage.buckets (id, name, public)
values ('ticket-files', 'ticket-files', true)
on conflict (id) do nothing;

create policy "ticket_files_select_authenticated"
on storage.objects for select
using (bucket_id = 'ticket-files' and auth.role() = 'authenticated');

create policy "ticket_files_insert_authenticated"
on storage.objects for insert
with check (bucket_id = 'ticket-files' and auth.role() = 'authenticated');
