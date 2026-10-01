'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import ThanksForAttending from './ThanksForAttending';

export default function CheckinButton({
  eventId,
  eventSlug,
  eventName,
}: {
  eventId: string;
  eventSlug: string;
  eventName: string;
}) {
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
    'idle',
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [awardedPoints, setAwardedPoints] = useState(0);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Check for a real, existing checkin — not just leftover client state
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata.full_name ?? user.email,
        });

        const { data: existing } = await supabase
          .from('checkins')
          .select('points_awarded')
          .eq('user_id', user.id)
          .eq('event_id', eventId)
          .maybeSingle();

        if (existing) {
          setAwardedPoints(existing.points_awarded);
          setStatus('done');
        }
      }

      setCheckingAuth(false);
    }

    init();
  }, [eventId]);

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/attendance/e/${eventSlug}`,
        queryParams: { hd: 'ucsd.edu' },
      },
    });
  }

  async function handleCheckin() {
    setStatus('loading');

    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (!event) {
      setStatus('error');
      setErrorMsg('Event no longer exists.');
      return;
    }

    const now = new Date();
    if (event.active_start && now < new Date(event.active_start)) {
      setStatus('error');
      setErrorMsg('This event has not started yet.');
      return;
    }
    if (event.active_end && now > new Date(event.active_end)) {
      setStatus('error');
      setErrorMsg('This event has ended.');
      return;
    }

    const { error } = await supabase.from('checkins').insert({
      user_id: user.id,
      event_id: eventId,
      points_awarded: event.points,
    });

    if (error) {
      setStatus('error');
      setErrorMsg(
        error.code === '23505'
          ? "You've already checked into this event."
          : error.message,
      );
      return;
    }

    setAwardedPoints(event.points);
    setStatus('done');
  }

  if (checkingAuth)
    return <p className="flex items-center justify-center">Loading...</p>;

  if (status === 'done')
    return <ThanksForAttending points={awardedPoints} eventName={eventName} />;

  if (!user) {
    return (
      <button
        className="flex w-full items-center justify-center bg-white text-center text-sm text-black hover:bg-neutral-200 disabled:opacity-50 py-4"
        onClick={handleGoogleLogin}
      >
        Sign in with UCSD Account
      </button>
    );
  }

  return (
    <div className='relative'>
      <button
        onClick={handleCheckin}
        disabled={status === 'loading'}
        className="py-4 flex w-full items-center justify-center bg-white text-center text-sm text-black hover:bg-neutral-200 disabled:opacity-50"
      >
        {status === 'loading' ? 'Checking in...' : 'Check in'}
      </button>
      {status === 'error' && <p className='absolute inset-x-0 top-full flex items-center justify-center pt-2 text-center text-sm'>{errorMsg}</p>}
    </div>
  );
}
