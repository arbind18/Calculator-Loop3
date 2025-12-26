import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact - Calculator Loop',
  description: 'Contact Calculator Loop for feedback, support, or calculator requests. We typically respond within 24 hours.',
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
