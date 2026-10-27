-- Local development seed: test users plus copies of the real events.
-- Streak-testing fixtures live in seeds/streak.sql and load on demand:
--   supabase db reset && npm run db:seed:streak

alter table events add column if not exists counts_toward_streak boolean not null default false;
alter table checkins add column if not exists bonus_points integer not null default 0;
alter table checkins add column if not exists streak_count integer not null default 0;
alter table events add column if not exists description text;
alter table events add column if not exists feedback_url text;

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

insert into public.events (id, slug, name, points, thumbnail_url, event_date, active_start, active_end, counts_toward_streak, description, feedback_url) values
  ('4bb6f943-f021-4f2a-aa7e-0946a6a62e28', 'fall-kickoff-26', 'Fall Kickoff 2026', 100,
   'https://bxyxpauwhavfwzfhmibk.supabase.co/storage/v1/object/public/event-thumbnails/fall-kickoff-26.png',
   '2026-09-30', '2026-09-30T18:00:00+00:00', '2026-10-01T08:00:00+00:00', false,
   'Kick off the year with DCo! Meet the board, learn what we have planned this quarter, and find your design community.',
   'https://example.com/feedback/fall-kickoff-26'),
  ('af5f0b25-53ea-4c13-80db-d5a40511174f', 'intro-to-design-26', 'Intro to Design', 100,
   'https://bxyxpauwhavfwzfhmibk.supabase.co/storage/v1/object/public/event-thumbnails/intro-to-design-26.png',
   '2026-10-07', '2026-10-08T01:00:00+00:00', '2026-10-08T03:00:00+00:00', true,
   'Join DCo for an introduction to the absolute fundamentals of design — from various fields to basic principles and elements, we’ll cover all the information you need to start your design journey.',
   'https://example.com/feedback/intro-to-design-26'),
  ('6d4428b0-4c0a-4d8d-ae72-d1a3c9abe9fa', 'slime-social-26', 'Slime Social', 100,
   'https://bxyxpauwhavfwzfhmibk.supabase.co/storage/v1/object/public/event-thumbnails/slime-social-26.png',
   '2026-10-14', '2026-10-15T01:30:00+00:00', '2026-10-15T02:45:00+00:00', true,
   'Take a break and make some slime with fellow designers. Snacks, music, and good company provided.',
   'https://example.com/feedback/slime-social-26'),
  -- No feedback link, to test the hidden Feedback button
  ('90e863be-9413-4967-a485-f7861d29f183', 'camp-dco-day1-26', 'Camp DCo Day 1', 100,
   'https://bxyxpauwhavfwzfhmibk.supabase.co/storage/v1/object/public/event-thumbnails/camp-dco-day1-26.png',
   '2026-10-21', '2026-10-22T01:00:00+00:00', '2026-10-22T03:00:00+00:00', true,
   'Day one of Camp DCo, our hands-on workshop series. Bring a laptop and an idea.',
   null);

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
