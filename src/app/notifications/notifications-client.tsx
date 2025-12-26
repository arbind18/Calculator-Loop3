"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils'

type NotificationItem = {
  id: string
  title: string
  body?: string | null
  url?: string | null
  readAt?: string | null
  createdAt: string
}

export function NotificationsClient() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [items, setItems] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const isLoggedIn = Boolean((session?.user as any)?.id)

  const load = async () => {
    if (!isLoggedIn) return
    setLoading(true)
    try {
      const res = await fetch('/api/notifications?take=30', { cache: 'no-store' })
      const json = await res.json()
      if (json?.success) {
        setItems(json.items || [])
        setUnreadCount(Number(json.unreadCount || 0))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!isLoggedIn) {
      setLoading(false)
      return
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isLoggedIn])

  const markAllRead = async () => {
    await fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    }).catch(() => null)
    setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })))
    setUnreadCount(0)
  }

  const openPushPrompt = () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new Event('calculatorloop:open-push-prompt'))
  }

  if (status === 'loading') return null

  if (!isLoggedIn) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="mt-2 text-muted-foreground">Please login to view your notifications.</p>
        <div className="mt-6">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={openPushPrompt}>
            Manage alerts
          </Button>
          <Button variant="secondary" disabled={unreadCount === 0} onClick={markAllRead}>
            Mark all read
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <Card className="p-4 text-sm text-muted-foreground">Loading...</Card>
        ) : items.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">No notifications yet.</Card>
        ) : (
          items.map((n) => {
            const isUnread = !n.readAt
            return (
              <Card
                key={n.id}
                className={
                  'p-4 transition-colors hover:bg-muted/40 cursor-pointer ' +
                  (isUnread ? 'border-primary/30' : '')
                }
                onClick={async () => {
                  await fetch('/api/notifications/read', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: n.id }),
                  }).catch(() => null)
                  setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x)))
                  setUnreadCount((c) => (isUnread ? Math.max(0, c - 1) : c))
                  router.push(n.url || '/')
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className={isUnread ? 'font-medium' : 'font-normal'}>{n.title}</div>
                    {n.body ? <div className="mt-1 text-sm text-muted-foreground">{n.body}</div> : null}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{formatRelativeTime(n.createdAt)}</div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
