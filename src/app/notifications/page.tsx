import { Metadata } from 'next'
import { NotificationsClient } from './notifications-client'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Your in-app notifications',
}

export default function NotificationsPage() {
  return <NotificationsClient />
}
