-- Local development seed. Fake data only.

alter table events add column if not exists counts_toward_streak boolean not null default false;
alter table checkins add column if not exists bonus_points integer not null default 0;
alter table checkins add column if not exists streak_count integer not null default 0;

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

-- Events: streak-past-1 is the most recent past streak event.

insert into public.events (slug, name, points, event_date, active_start, active_end, counts_toward_streak)
select
  'streak-past-' || n, 'Streak Past ' || n, 100,
  (now() - make_interval(weeks => n))::date,
  now() - make_interval(weeks => n),
  now() - make_interval(weeks => n) + interval '2 hours',
  true
from generate_series(1, 7) as n;

insert into public.events (slug, name, points, event_date, active_start, active_end, counts_toward_streak) values
  ('non-streak-past', 'Non-Streak Past', 100, (now() - interval '10 days')::date,
   now() - interval '10 days', now() - interval '10 days' + interval '2 hours', false),
  ('streak-test', 'Streak Test', 100, now()::date,
   now() - interval '30 minutes', now() + interval '2 hours', true);

-- Check-ins: A attended every past event; B missed streak-past-3; C attended none.

insert into public.checkins (user_id, event_id, points_awarded, checked_in_at)
select u.id, e.id, 100, e.active_start + interval '15 minutes'
from public.events e
cross join (values
  ('00000000-0000-0000-0000-0000000000a1'::uuid),
  ('00000000-0000-0000-0000-0000000000b2'::uuid)
) as u(id)
where e.slug <> 'streak-test'
  and not (u.id = '00000000-0000-0000-0000-0000000000b2' and e.slug = 'streak-past-3');
