import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id as string | undefined

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const takeRaw = searchParams.get('take')
    const unreadOnly = searchParams.get('unreadOnly') === '1'

    const take = Math.max(1, Math.min(30, Number(takeRaw || 10) || 10))

    const [items, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId,
          ...(unreadOnly ? { readAt: null } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take,
        select: {
          id: true,
          title: true,
          body: true,
          url: true,
          readAt: true,
          createdAt: true,
        },
      }),
      prisma.notification.count({
        where: {
          userId,
          readAt: null,
        },
      }),
    ])

    return NextResponse.json({ success: true, items, unreadCount })
  } catch (error: any) {
    console.error('Notifications GET error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to load notifications' },
      { status: 500 }
    )
  }
}
