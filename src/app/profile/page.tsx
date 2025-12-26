import type { Metadata } from 'next'
import ProfileClient from './ProfileClient'

export const metadata: Metadata = {
  title: 'Profile - Calculator Loop',
  description: 'Manage your profile, favorites, saved calculations, and history.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ProfilePage() {
  return <ProfileClient />
}
