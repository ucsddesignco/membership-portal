-- Local development seed: test users plus copies of the real events.
-- Streak-testing fixtures live in seeds/streak.sql and load on demand:
--   supabase db reset && npm run db:seed:streak

alter table events add column if not exists counts_toward_streak boolean not null default false;
alter table checkins add column if not exists bonus_points integer not null default 0;
alter table checkins add column if not exists streak_count integer not null default 0;
alter table events add column if not exists description text;
alter table events add column if not exists category text;

-- Event feedback: one per attendee per event, not editable, worth a flat 20 points

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  event_id uuid not null references public.events(id) on delete restrict,
  rating smallint not null check (rating between 1 and 5),
  liked text not null check (length(btrim(liked)) between 1 and 2000),
  improve text not null check (length(btrim(improve)) between 1 and 2000),
  would_return boolean not null,
  suggestions text check (suggestions is null or length(suggestions) <= 2000),
  points_awarded integer not null default 20 check (points_awarded = 20),
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

alter table public.feedback enable row level security;

-- No update/delete policies, so submitted feedback can't be edited
drop policy if exists "insert own feedback for attended events" on public.feedback;
create policy "insert own feedback for attended events" on public.feedback for insert
  with check (auth.uid() = user_id and exists (
    select 1 from public.checkins c where c.user_id = auth.uid() and c.event_id = feedback.event_id));

drop policy if exists "select own feedback" on public.feedback;
create policy "select own feedback" on public.feedback for select
  using (auth.uid() = user_id);

drop policy if exists "admins read all feedback" on public.feedback;
create policy "admins read all feedback" on public.feedback for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- Anonymous views for exporting to Google Sheets from the SQL editor. security_invoker plus the
-- revoke keeps them from exposing everyone's feedback through the API.

create or replace view public.feedback_export with (security_invoker = true) as
select e.event_date as "Date", e.name as "Event", e.category as "Type",
       f.rating as "Rating (1-5)",
       case when f.would_return then 'Yes' else 'No' end as "Would come again",
       f.liked as "Liked", f.improve as "Could be better",
       coalesce(f.suggestions, '') as "Suggestions",
       f.created_at as "Submitted at"
from public.feedback f join public.events e on e.id = f.event_id
order by e.event_date desc, f.created_at;

create or replace view public.feedback_summary with (security_invoker = true) as
select e.event_date as "Date", e.name as "Event", count(*) as "Responses",
       round(avg(f.rating), 2) as "Avg rating",
       round(100.0 * avg(f.would_return::int), 0) as "% would come again"
from public.feedback f join public.events e on e.id = f.event_id
group by e.id, e.event_date, e.name
order by e.event_date desc;

revoke all on public.feedback_export, public.feedback_summary from anon, authenticated;

-- Users (password: password123)

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new,
  email_change_token_current, email_change, phone_change, phone_change_token,
  reauthentication_token
)
select
  '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated',
  u.email, extensions.crypt('password123', extensions.gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{}', now(), now(),
  '', '', '', '', '', '', '', ''
from (values
  ('00000000-0000-0000-0000-0000000000a1'::uuid, 'a@test.dev'),
  ('00000000-0000-0000-0000-0000000000b2'::uuid, 'b@test.dev'),
  ('00000000-0000-0000-0000-0000000000c3'::uuid, 'c@test.dev')
) as u(id, email);

insert into auth.identities (
  id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
)
select
  gen_random_uuid(), id, id::text, 'email',
  jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true),
  now(), now(), now()
from auth.users
where email in ('a@test.dev', 'b@test.dev', 'c@test.dev');

insert into public.profiles (id, email, full_name) values
  ('00000000-0000-0000-0000-0000000000a1', 'a@test.dev', 'Test A'),
  ('00000000-0000-0000-0000-0000000000b2', 'b@test.dev', 'Test B'),
  ('00000000-0000-0000-0000-0000000000c3', 'c@test.dev', 'Test C');

-- Real events, copied from the production DB so /events shows real names and posters.
-- Thumbnails point at the production public bucket, which is fine to load from localhost.

insert into public.events (id, slug, name, points, thumbnail_url, event_date, active_start, active_end, counts_toward_streak, description) values
  ('4bb6f943-f021-4f2a-aa7e-0946a6a62e28', 'fall-kickoff-26', 'Fall Kickoff 2026', 100,
   'https://bxyxpauwhavfwzfhmibk.supabase.co/storage/v1/object/public/event-thumbnails/fall-kickoff-26.png',
   '2026-09-30', '2026-09-30T18:00:00+00:00', '2026-10-01T08:00:00+00:00', false,
   'Kick off the year with DCo! Meet the board, learn what we have planned this quarter, and find your design community.'),
  ('af5f0b25-53ea-4c13-80db-d5a40511174f', 'intro-to-design-26', 'Intro to Design', 100,
   'https://bxyxpauwhavfwzfhmibk.supabase.co/storage/v1/object/public/event-thumbnails/intro-to-design-26.png',
   '2026-10-07', '2026-10-08T01:00:00+00:00', '2026-10-08T03:00:00+00:00', true,
   'Join DCo for an introduction to the absolute fundamentals of design — from various fields to basic principles and elements, we’ll cover all the information you need to start your design journey.'),
  ('6d4428b0-4c0a-4d8d-ae72-d1a3c9abe9fa', 'slime-social-26', 'Slime Social', 100,
   'https://bxyxpauwhavfwzfhmibk.supabase.co/storage/v1/object/public/event-thumbnails/slime-social-26.png',
   '2026-10-14', '2026-10-15T01:30:00+00:00', '2026-10-15T02:45:00+00:00', true,
   'Take a break and make some slime with fellow designers. Snacks, music, and good company provided.'),
  ('90e863be-9413-4967-a485-f7861d29f183', 'camp-dco-day1-26', 'Camp DCo Day 1', 100,
   'https://bxyxpauwhavfwzfhmibk.supabase.co/storage/v1/object/public/event-thumbnails/camp-dco-26.png',
   '2026-10-21', '2026-10-22T01:00:00+00:00', '2026-10-22T03:00:00+00:00', true,
   'Day one of Camp DCo, our hands-on workshop series. Bring a laptop and an idea.'),
  ('00525bc0-9b6e-4e90-a042-5da74ab15a58', 'camp-dco-day2-26', 'Camp DCo Day 2', 100,
   'https://bxyxpauwhavfwzfhmibk.supabase.co/storage/v1/object/public/event-thumbnails/camp-dco-26.png',
   '2026-10-28', '2026-10-29T01:30:00+00:00', '2026-10-29T03:00:00+00:00', true,
   'Day two of Camp DCo, our hands-on workshop series. Keep building on what you started on day one.');

-- A: attended all but Fall Kickoff, with a streak bonus at Camp DCo. B: only Fall Kickoff. C: none.

insert into public.checkins (user_id, event_id, points_awarded, bonus_points, checked_in_at)
select u.id, e.id, 100, u.bonus, e.active_start + interval '15 minutes'
from (values
  ('00000000-0000-0000-0000-0000000000a1'::uuid, 'intro-to-design-26', 0),
  ('00000000-0000-0000-0000-0000000000a1'::uuid, 'slime-social-26', 0),
  ('00000000-0000-0000-0000-0000000000a1'::uuid, 'camp-dco-day1-26', 50),
  ('00000000-0000-0000-0000-0000000000b2'::uuid, 'fall-kickoff-26', 0)
) as u(id, slug, bonus)
join public.events e on e.slug = u.slug;

update public.events set category = 'GBM' where slug in ('fall-kickoff-26', 'intro-to-design-26');
update public.events set category = 'Social' where slug = 'slime-social-26';
update public.events set category = 'Workshop' where slug in ('camp-dco-day1-26', 'camp-dco-day2-26');

-- A already sent feedback for Intro to Design, so the Sent state shows without submitting

insert into public.feedback (user_id, event_id, rating, liked, improve, would_return, suggestions)
select '00000000-0000-0000-0000-0000000000a1', id, 4,
  'Clear intro to the fundamentals, and the examples were fun.',
  'It ran a little long. A short break halfway through would help.',
  true, 'More hands-on mini exercises.'
from public.events where slug = 'intro-to-design-26';
