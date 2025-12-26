import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type MarkReadBody = {
  id?: string
  all?: boolean
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id as string | undefined

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json().catch(() => ({}))) as MarkReadBody
    const now = new Date()

    if (body.all) {
      const result = await prisma.notification.updateMany({
        where: { userId, readAt: null },
        data: { readAt: now },
      })
      return NextResponse.json({ success: true, updated: result.count })
    }

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    }

    const updated = await prisma.notification.updateMany({
      where: { id: body.id, userId },
      data: { readAt: now },
    })

    if (updated.count === 0) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Notifications read error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to mark read' },
      { status: 500 }
    )
  }
}
