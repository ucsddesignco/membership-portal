'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const [fullName, setFullName] = useState<string>('');
  const [totalPoints, setTotalPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/attendance/login';
        return;
      }

      if (!user.email?.endsWith('@ucsd.edu')) {
        await supabase.auth.signOut();
        window.location.href = '/attendance/login';
        return;
      }

      const firstName =
        user.user_metadata.given_name ??
        user.user_metadata.full_name?.split(' ')[0] ??
        user.email;

      setFullName(firstName);

      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: name,
      });

      const { data: checkins } = await supabase
        .from('checkins')
        .select('points_awarded')
        .eq('user_id', user.id);

      const total =
        checkins?.reduce((sum, row) => sum + row.points_awarded, 0) ?? 0;
      setTotalPoints(total);
      setLoading(false);
    }

    init();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Hello {fullName}!</h1>
      <p>You have {totalPoints} points total!</p>
    </div>
  );
}
