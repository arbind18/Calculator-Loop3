"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatRelativeTime } from '@/lib/utils'
import { useSettings } from '@/components/providers/SettingsProvider'

type NotificationItem = {
  id: string
  title: string
  body?: string | null
  url?: string | null
  readAt?: string | null
  createdAt: string
}

export function NotificationBell() {
  const { language } = useSettings()
  const prefix = language === 'en' ? '' : `/${language}`
  const withLocale = (path: string) => `${prefix}${path}`
  const router = useRouter()
  const { data: session } = useSession()

  const [items, setItems] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const isLoggedIn = Boolean((session?.user as any)?.id)

  const hasUnread = unreadCount > 0

  const load = async () => {
    if (!isLoggedIn) return
    setLoading(true)
    try {
      const res = await fetch('/api/notifications?take=8', { cache: 'no-store' })
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
    // Fetch once after login so badge can show.
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const openPushPrompt = () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new Event('calculatorloop:open-push-prompt'))
  }

  const markRead = async (id: string) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)))
      setUnreadCount((c) => Math.max(0, c - 1))
    } catch {
      // ignore
    }
  }

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      })
      setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })))
      setUnreadCount(0)
    } catch {
      // ignore
    }
  }

  const emptyLabel = useMemo(() => {
    if (!isLoggedIn) return 'Login to see notifications'
    if (loading) return 'Loading...'
    return 'No notifications yet'
  }, [isLoggedIn, loading])

  return (
    <DropdownMenu onOpenChange={(open) => (open ? load() : null)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute -top-0.5 -right-0.5">
              <Badge className="h-5 min-w-5 px-1.5 text-[11px] leading-5" variant="default">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {isLoggedIn && unreadCount > 0 && (
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                markAllRead()
              }}
            >
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {items.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">{emptyLabel}</div>
        ) : (
          <div className="max-h-[360px] overflow-auto">
            {items.map((n) => {
              const isUnread = !n.readAt
              return (
                <DropdownMenuItem
                  key={n.id}
                  className="flex flex-col items-start gap-1 whitespace-normal"
                  onSelect={async (e) => {
                    e.preventDefault()
                    if (isUnread) await markRead(n.id)
                    const target = n.url || '/notifications'
                    const href = target.startsWith('/') ? withLocale(target) : target
                    router.push(href)
                  }}
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <span className={isUnread ? 'font-medium' : 'font-normal'}>{n.title}</span>
                    <span className="text-[11px] text-muted-foreground">{formatRelativeTime(n.createdAt)}</span>
                  </div>
                  {n.body ? <span className="text-xs text-muted-foreground line-clamp-2">{n.body}</span> : null}
                </DropdownMenuItem>
              )
            })}
          </div>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={withLocale('/notifications')}>View all</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            openPushPrompt()
          }}
        >
          Enable alerts
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
