import Header from '../Header'
import EventList from './EventList'

export default function EventsPage() {
  return (
    <main className="min-h-dvh bg-black font-nb text-white">
      <Header />
      <div className="mx-auto mt-8 w-full max-w-[329px] pb-10">
        <EventList />
      </div>
    </main>
  )
}
