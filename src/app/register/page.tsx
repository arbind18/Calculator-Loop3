import type { Metadata } from 'next'
import RegisterClient from './RegisterClient'

export const metadata: Metadata = {
  title: 'Register - Calculator Loop',
  description: 'Create an account to save calculators, favorites, and calculation history.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RegisterPage() {
  return <RegisterClient />
}
