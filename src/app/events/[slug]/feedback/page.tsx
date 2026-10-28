import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import Header from '../../../Header'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Placeholder until the feedback form is designed
export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data: event, error } = await supabase
    .from('events')
    .select('name, event_date')
    .eq('slug', slug)
    .single()

  return (
    <main className="min-h-dvh bg-black font-nb text-white">
      <Header />
      <div className="mx-auto mt-16 flex w-full max-w-[329px] flex-col items-center gap-4 text-center">
        {error || !event ? (
          <p>Event not found.</p>
        ) : (
          <>
            <h1 className="text-[24px] leading-tight">{event.name}</h1>
            {event.event_date && (
              <p className="text-[12px] text-white/70">
                {/* event_date is date-only, which parses as UTC midnight */}
                {new Date(event.event_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
              </p>
            )}
            <p className="text-[14px]">Feedback form coming soon</p>
          </>
        )}
        <Link href="/events" className="text-[12px] text-white/70 underline hover:text-white">
          Back to events
        </Link>
      </div>
    </main>
  )
}
