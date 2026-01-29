import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Calculator Loop',
  description: 'Terms of Service for Calculator Loop: usage guidelines, responsibilities, and updates.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 py-16 space-y-8 max-w-3xl">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">
          By using Calculator Loop, you agree to these terms. If you do not agree, please do not use the platform.
          These terms guide responsible and secure use of the service.
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Use of calculators</h2>
          <p className="text-muted-foreground">
            Calculators are provided for informational purposes. Results depend on inputs and assumptions.
            Please verify important financial, health, or legal decisions independently.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Accounts</h2>
          <p className="text-muted-foreground">
            If you create an account, you are responsible for keeping your credentials safe. Please notify us immediately
            about any unauthorized access.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Acceptable use</h2>
          <p className="text-muted-foreground">
            Misuse, unauthorized access attempts, or disrupting site operations is strictly prohibited.
            We promote fair usage to keep the experience smooth for everyone.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Content & ownership</h2>
          <p className="text-muted-foreground">
            Calculator logic, UI, and content are the intellectual property of Calculator Loop. You may access the platform
            for personal use, but unauthorized copying or redistribution is not allowed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Service availability</h2>
          <p className="text-muted-foreground">
            We strive to keep the platform reliable, but maintenance, updates, or technical issues may cause temporary downtime.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Changes</h2>
          <p className="text-muted-foreground">
            We may update these terms from time to time. Continued use means you accept the updated terms.
            The latest version will always be available on this page.
          </p>
        </section>
      </div>
    </main>
  )
}
