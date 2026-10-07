import { createClient } from '@supabase/supabase-js'
import CheckinButton from './CheckinButton'
import Footer from '../../Footer'

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
  const isMock = slug == 'demo'

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !event) {
    return <p>Event not found.</p>
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Content column: 296px wide, like Frame 31 */}
      <div className="mx-auto flex w-full max-w-[296px] flex-col gap-[75px] pt-[68px] pb-12">
        <div className="flex flex-col">
          {/* Image with both arrows anchored to it */}
          <div className="relative">
            <img
              src={event.thumbnail_url || '/GraphicHolder.png'}
              alt={event.name}
              className="block h-auto w-full border-1 border-white"
            />

            {/* Arrow on the bottom-right corner of the graphic */}
            <img
              src="/arrow2.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-[81%] top-[94.5%] h-auto w-[13%]"
            />

            {/* Arrow just below the graphic, on the left */}
            <img
              src="/arrow1.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -left-[2%] top-[108.5%] h-auto w-[13%]"
            />
          </div>

          <div className="mt-8 text-center">
            <h1 className="text-3xl font-extrabold">Welcome!</h1>
            <p className="mt-1 text-sm">Sign in for attendance points :)</p>
          </div>

          <div className="mt-4 w-full">
            <CheckinButton eventId={event.id} eventSlug={slug} />
          </div>
        </div>

        <Footer>
          ✨ Design tip of the day:
          <br />
          Dont be scared of scale!
        </Footer>
      </div>
    </main>
  )
}