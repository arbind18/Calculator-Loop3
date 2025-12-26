import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type IncomingSubscription = {
  endpoint?: string
  keys?: {
    p256dh?: string
    auth?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const subscription = (await request.json()) as IncomingSubscription

    const endpoint = subscription?.endpoint
    const p256dh = subscription?.keys?.p256dh
    const auth = subscription?.keys?.auth

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json(
        { success: false, error: 'Invalid subscription payload' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id as string | undefined

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh,
        auth,
        userId: userId ?? null,
      },
      create: {
        endpoint,
        p256dh,
        auth,
        userId: userId ?? null,
      },
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription saved successfully' 
    })
  } catch (error) {
    console.error('Error saving subscription:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save subscription' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as { endpoint?: string }
    const endpoint = body?.endpoint
    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: 'Missing endpoint' },
        { status: 400 }
      )
    }

    await prisma.pushSubscription.delete({ where: { endpoint } })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription removed successfully' 
    })
  } catch (error) {
    console.error('Error removing subscription:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove subscription' },
      { status: 500 }
    )
  }
}
