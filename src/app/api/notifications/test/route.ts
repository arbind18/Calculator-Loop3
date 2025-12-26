import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import webpush from 'web-push'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type TestPayload = {
  title?: string
  body?: string
  url?: string
  icon?: string
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env: ${name}`)
  return value
}

export async function POST(req: NextRequest) {
  try {
    const db = prisma as any

    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id as string | undefined

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { title, body, url, icon } = (await req.json().catch(() => ({}))) as TestPayload

    const publicKey = requireEnv('NEXT_PUBLIC_VAPID_PUBLIC_KEY')
    const privateKey = requireEnv('VAPID_PRIVATE_KEY')
    const subject = process.env.VAPID_SUBJECT || 'mailto:admin@calculatorloop.local'

    webpush.setVapidDetails(subject, publicKey, privateKey)

    const subs = await db.pushSubscription.findMany({
      where: { userId },
    })

    if (subs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No push subscription found for this user. Please Subscribe first.' },
        { status: 400 }
      )
    }

    const payload = JSON.stringify({
      title: title || 'Calculator Loop',
      body: body || 'Test notification',
      url: url || '/',
      icon: icon || '/logo.svg',
      badge: '/logo.svg',
    })

    let sentCount = 0
    let errorCount = 0

    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          payload
        )
        sentCount++
      } catch (error: any) {
        errorCount++

        const statusCode = error?.statusCode
        if (statusCode === 404 || statusCode === 410) {
          await db.pushSubscription.delete({ where: { endpoint: sub.endpoint } }).catch(() => null)
        }
      }
    }

    await db.notificationEvent.create({
      data: {
        title: title || 'Calculator Loop',
        body: body || 'Test notification',
        url: url || '/',
        icon: icon || '/logo.svg',
        sentCount,
        errorCount,
      },
    })

    // In-app notification (Notification Center)
    await db.notification.create({
      data: {
        userId,
        title: title || 'Calculator Loop',
        body: body || 'Test notification',
        url: url || '/',
      },
    })

    return NextResponse.json({ success: true, sentCount, errorCount })
  } catch (error: any) {
    console.error('Push test error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to send test notification' },
      { status: 500 }
    )
  }
}
