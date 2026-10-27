-- Streak-testing fixtures. Opt-in: requires seed.sql to have run first.
--   supabase db reset && npm run db:seed:streak
-- `supabase db reset` on its own goes back to the default data.
--
-- Check in at /attendance/e/streak-test to test. Expected streaks, counting the real
-- streak events from seed.sql too: A = 11 (2x), B = 6 (2x, broken at streak-past-3), C = 1 (1x).

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

-- Check-ins: A attended every past fixture; B missed streak-past-3; C attended none.

insert into public.checkins (user_id, event_id, points_awarded, checked_in_at)
select u.id, e.id, 100, e.active_start + interval '15 minutes'
from public.events e
cross join (values
  ('00000000-0000-0000-0000-0000000000a1'::uuid),
  ('00000000-0000-0000-0000-0000000000b2'::uuid)
) as u(id)
where (e.slug like 'streak-past-%' or e.slug = 'non-streak-past')
  and not (u.id = '00000000-0000-0000-0000-0000000000b2' and e.slug = 'streak-past-3');

-- The real streak events sit between these fixtures. A already attended them; check B in
-- too, so streak-past-3 stays B's only missed streak event.

insert into public.checkins (user_id, event_id, points_awarded, checked_in_at)
select '00000000-0000-0000-0000-0000000000b2', e.id, 100, e.active_start + interval '15 minutes'
from public.events e
where e.slug in ('intro-to-design-26', 'slime-social-26', 'camp-dco-day1-26')
on conflict (user_id, event_id) do nothing;
