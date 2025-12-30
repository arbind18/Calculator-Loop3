import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Calculator Loop',
  description: 'Terms of Service for using Calculator Loop calculators and services.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 py-16 space-y-8 max-w-3xl">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">
          By using Calculator Loop, you agree to these terms. If you do not agree, please do not use the site.
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Use of calculators</h2>
          <p className="text-muted-foreground">
            Calculators are provided for informational purposes. Results may vary based on inputs and assumptions.
            You are responsible for verifying important decisions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Accounts</h2>
          <p className="text-muted-foreground">
            If you create an account, you are responsible for maintaining the confidentiality of your credentials.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Acceptable use</h2>
          <p className="text-muted-foreground">
            Do not misuse the service, attempt unauthorized access, or disrupt site operations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Changes</h2>
          <p className="text-muted-foreground">
            We may update these terms from time to time. Continued use means you accept the updated terms.
          </p>
        </section>
      </div>
    </main>
  )
}
