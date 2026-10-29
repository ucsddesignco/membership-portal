import { Suspense } from 'react'
import Header from '../Header'
import EventList from './EventList'

export default function EventsPage() {
  return (
    <main className="min-h-dvh bg-black font-nb text-white">
      <Header />
      <div className="mx-auto mt-8 w-full max-w-[329px] pb-10">
        {/* EventList reads ?sent=, which needs a Suspense boundary to prerender */}
        <Suspense fallback={<p className="py-16 text-center text-xs">Loading...</p>}>
          <EventList />
        </Suspense>
      </div>
    </main>
  )
}
