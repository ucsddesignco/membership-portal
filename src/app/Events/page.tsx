export default function EventsPage() {
  return (
    <main className="m-auto w-full max-w-[90rem] p-10">
      <div className="grid grid-cols-[minmax(0,1fr)_3fr] gap-16">
        <div className="max-w-sm">
          <h1 className="text-[5rem] leading-tight">Events</h1>
          <p className="mt-2 text-[1.5rem] font-light">
            These are the events that are happening this week...
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <div className="h-56 w-full rounded-lg border-2 border-foreground" />
          <div className="h-56 w-full rounded-lg border-2 border-foreground" />
          <div className="h-56 w-full rounded-lg border-2 border-foreground" />
        </div>
      </div>
    </main>
  );
}
