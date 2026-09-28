// src/app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-extrabold">DesignCo Membership Portal</h1>
        <p className="mt-4 text-sm text-neutral-300">
          Track your attendance and points for DesignCo events. Sign in with
          your UCSD account to check in at events and view your point total.
        </p>

        <Link
          href="/attendance/login"
          className="mt-8 w-full bg-white py-4 text-sm text-black hover:bg-neutral-200"
        >
          Sign in with UCSD Account
        </Link>
      </div>
    </main>
  )
}