import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Calculator Loop',
  description: 'Privacy Policy for Calculator Loop. Learn what data we collect and how we use it.',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 py-16 space-y-8 max-w-3xl">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">
          This Privacy Policy explains how Calculator Loop collects, uses, and protects your information.
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Information we collect</h2>
          <p className="text-muted-foreground">
            We may collect basic usage data to improve performance and reliability. If you create an account,
            we store the details needed to provide features like favorites and history.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">How we use information</h2>
          <p className="text-muted-foreground">
            We use information to operate the site, deliver requested features, prevent abuse, and improve calculators.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Cookies</h2>
          <p className="text-muted-foreground">
            We may use cookies to maintain sessions and measure site performance. You can control cookies in your browser settings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">
            Questions? Use the contact page to reach us.
          </p>
        </section>
      </div>
    </main>
  )
}
