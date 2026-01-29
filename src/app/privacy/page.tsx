import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Calculator Loop',
  description: 'Calculator Loop Privacy Policy: data collection, usage, security, cookies, and user rights explained clearly.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 py-16 space-y-8 max-w-3xl">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Your trust matters most. This Privacy Policy explains what data we collect, why we collect it, and how we protect it
          in a simple and transparent way.
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Information we collect</h2>
          <p className="text-muted-foreground">
            We collect only the minimum data needed to improve the platform. This may include basic usage data
            (page views, feature usage, error logs) and, if you create an account, account-related details
            (email, preferences, favorites, history).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">How we use information</h2>
          <p className="text-muted-foreground">
            We use data to operate the site, improve calculators, monitor performance, and enhance the user experience.
            We do not use it for unauthorized marketing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">AI usage</h2>
          <p className="text-muted-foreground">
            AI features help users find the right tool, understand results, and navigate faster. The goal is clarity and speed,
            not misuse of your data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Cookies</h2>
          <p className="text-muted-foreground">
            Cookies may be used to maintain sessions, remember preferences, and measure performance.
            You can control or disable cookies in your browser settings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Data security</h2>
          <p className="text-muted-foreground">
            We follow reasonable security practices to keep data safe. However, no internet-based service can guarantee
            100% security, so we continuously improve.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Data retention</h2>
          <p className="text-muted-foreground">
            We retain data only as long as needed to provide the service. When it is no longer required, we follow
            safe removal processes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Third-party services</h2>
          <p className="text-muted-foreground">
            We may use trusted third-party services for analytics or performance monitoring. We only choose providers
            that follow privacy best practices.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Your choices</h2>
          <p className="text-muted-foreground">
            You can manage cookies through your browser settings and keep usage minimal by not using account features.
            For data-related requests, reach out through the contact page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">
            If you have any privacy-related questions, reach us through the contact page. We will prioritize your request.
          </p>
        </section>
      </div>
    </main>
  )
}
