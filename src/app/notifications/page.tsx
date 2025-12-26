import { Metadata } from 'next'
import { NotificationsClient } from './notifications-client'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Your in-app notifications',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotificationsPage() {
  return <NotificationsClient />
}
