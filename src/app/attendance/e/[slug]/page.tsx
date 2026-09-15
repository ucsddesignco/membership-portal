import { createClient } from '@supabase/supabase-js'
import CheckinButton from './CheckinButton'


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !event) {
    return <p>Event not found.</p>
  }

  return (
    <div>
      {event.thumbnail_url && (
        <img src={event.thumbnail_url} alt={event.name} />
      )}
      <h1>Check into DesignCo's {event.name}!</h1>
      <p>You're about to earn {event.points} points</p>
      <CheckinButton eventId={event.id} eventSlug={slug} />
    </div>
  )
}