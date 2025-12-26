import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch user profile
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        // Cast to any to avoid Prisma type drift in some Windows setups
        occupation: true,
        purpose: true,
        createdAt: true,
        totalCalculations: true,
        favoriteCategory: true,
        mostUsedCalculator: true
      } as any
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Profile GET Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update user profile
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const {
      name,
      occupation,
      purpose,
    } = await request.json()

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (occupation !== undefined) updateData.occupation = occupation
    if (purpose !== undefined) updateData.purpose = purpose

    // Keep data collection minimal by default
    updateData.personalizationOptIn = false
    updateData.adsPersonalizationOptIn = false

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData as any,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        occupation: true,
        purpose: true,
      } as any
    })

    return NextResponse.json({ 
      success: true, 
      user: updatedUser 
    })

  } catch (error) {
    console.error('Profile PATCH Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
