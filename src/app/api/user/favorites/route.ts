import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function refreshFavoriteCategoryFromFavorites(userId: string) {
  const byCategory = await prisma.favorite.groupBy({
    by: ['category'],
    where: { userId },
    _count: { _all: true },
    orderBy: { _count: { category: 'desc' } },
    take: 1,
  })

  await prisma.user.update({
    where: { id: userId },
    data: { favoriteCategory: byCategory[0]?.category ?? undefined },
  })
}

// GET - Fetch favorites
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
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { usageCount: 'desc' }
    })

    return NextResponse.json({ favorites })

  } catch (error) {
    console.error('Favorites GET Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add to favorites
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { calculatorId, calculatorName, category, description } = await request.json()

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_calculatorId: {
          userId: user.id,
          calculatorId
        }
      }
    })

    if (existing) {
      // Update usage count
      const updated = await prisma.favorite.update({
        where: { id: existing.id },
        data: {
          usageCount: { increment: 1 },
          lastUsed: new Date()
        }
      })
      return NextResponse.json({ success: true, favorite: updated })
    }

    // Create new favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        calculatorId,
        calculatorName,
        category,
        description: description || '',
        usageCount: 1,
        lastUsed: new Date()
      }
    })

    // Preference signals (only if user opted in)
    if (user.personalizationOptIn) {
      await refreshFavoriteCategoryFromFavorites(user.id)
    }

    return NextResponse.json({ success: true, favorite })

  } catch (error) {
    console.error('Favorites POST Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove from favorites
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const calculatorId = searchParams.get('calculatorId')

    if (!calculatorId) {
      return NextResponse.json(
        { error: 'Calculator ID required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    await prisma.favorite.delete({
      where: {
        userId_calculatorId: {
          userId: user.id,
          calculatorId
        }
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Favorites DELETE Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
