// src/app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col items-center justify-center px-6 text-center">
        <img
          src="/arrow2.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[12%] top-[24%] h-auto w-[38px]"
        />
        <img
          src="/arrow1.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[10%] top-[68%] h-auto w-[38px]"
        />

        <h1 className="text-3xl font-extrabold">DesignCo Membership Portal</h1>
        <p className="mt-4 text-sm text-neutral-300">
          The DesignCo Membership Portal tracks attendance and points for DesignCo
          events at UC San Diego. Sign in with your UCSD Google account to check in
          at events and view your point total.
        </p>

        <Link
          href="/attendance/login"
          className="mt-8 flex w-full items-center justify-center bg-white py-4 text-sm text-black hover:bg-neutral-200"
        >
          Continue to Login
        </Link>

        <Link href="/privacy" className="mt-6 text-xs text-neutral-400 underline">
          Privacy Policy
        </Link>
      </div>
    </main>
  )
}