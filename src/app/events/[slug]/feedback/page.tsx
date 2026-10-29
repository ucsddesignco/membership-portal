import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import Header from '../../../Header'
import { BackIcon } from '../../../icons'
import FeedbackForm from './FeedbackForm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data: event, error } = await supabase
    .from('events')
    .select('id, slug, name, thumbnail_url, description, category')
    .eq('slug', slug)
    .single()

  return (
    <main className="min-h-dvh bg-black font-nb text-white">
      <Header />
      <div className="mx-auto flex w-full max-w-[329px] flex-col gap-5 pt-5 pb-8">
        <Link href="/events" className="flex items-center gap-2 self-start py-[10px] text-[12px] leading-[14px]">
          <BackIcon className="block" />
          Back
        </Link>
        {error || !event ? <p className="text-center">Event not found.</p> : <FeedbackForm event={event} />}
      </div>
    </main>
  )
}
