// src/app/privacy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-[600px]">
        <h1 className="text-2xl font-extrabold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-neutral-400">Last updated: Sept 26, 2026</p>

        <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-neutral-300">
          <section>
            <h2 className="text-base font-bold text-white">What we collect</h2>
            <p className="mt-2">
              When you sign in with your UCSD Google account, we collect your name and
              @ucsd.edu email address. When you check in to a club event, we record which
              event you attended and the points awarded.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white">Why we collect it</h2>
            <p className="mt-2">
              This information is used solely to track attendance and points for DesignCo events, and to display your point total back to you when you log in.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white">Where it's stored</h2>
            <p className="mt-2">
              Your data is stored securely using Supabase, a hosted database provider. We
              do not sell or share your information with third parties, and it is not
              used for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white">Access restriction</h2>
            <p className="mt-2">
              Sign-in is restricted to @ucsd.edu Google accounts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white">Questions</h2>
            <p className="mt-2">
              If you have questions about this policy or want your data removed, contact
              us at designatucsd@gmail.com.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}