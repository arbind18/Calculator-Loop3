import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function refreshUserPreferenceSignals(userId: string) {
  // Most used category (from calculations)
  const byCategory = await prisma.calculation.groupBy({
    by: ['category'],
    where: { userId },
    _count: { _all: true },
    orderBy: { _count: { category: 'desc' } },
    take: 1,
  })

  // Most used calculator (from calculations)
  const byCalculator = await prisma.calculation.groupBy({
    by: ['calculatorType'],
    where: { userId },
    _count: { _all: true },
    orderBy: { _count: { calculatorType: 'desc' } },
    take: 1,
  })

  await prisma.user.update({
    where: { id: userId },
    data: {
      favoriteCategory: byCategory[0]?.category ?? undefined,
      mostUsedCalculator: byCalculator[0]?.calculatorType ?? undefined,
    },
  })
}

// GET - Fetch calculation history
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const where: any = { userId: user.id }
    if (category) {
      where.category = category
    }

    const calculations = await prisma.calculation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    const parsedCalculations = calculations.map(calc => ({
      ...calc,
      inputs: typeof calc.inputs === 'string' ? JSON.parse(calc.inputs) : calc.inputs,
      result: typeof calc.result === 'string' ? JSON.parse(calc.result) : calc.result
    }))

    const total = await prisma.calculation.count({ where })

    return NextResponse.json({
      calculations: parsedCalculations,
      total,
      hasMore: total > offset + limit
    })

  } catch (error) {
    console.error('History API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add calculation to history
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

    const { calculatorType, calculatorName, category, inputs, result } = await request.json()

    const calculation = await prisma.calculation.create({
      data: {
        userId: user.id,
        calculatorType,
        calculatorName,
        category,
        inputs: JSON.stringify(inputs),
        result: JSON.stringify(result)
      }
    })

    // Update user stats
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totalCalculations: { increment: 1 },
        lastVisit: new Date()
      }
    })

    // Preference signals (only if user opted in)
    if (user.personalizationOptIn) {
      await refreshUserPreferenceSignals(user.id)
    }

    return NextResponse.json({ success: true, calculation })

  } catch (error) {
    console.error('History POST Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove calculation from history
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
    const id = searchParams.get('id')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // If an id is provided, delete just that record (ownership-safe)
    if (id) {
      const deleted = await prisma.calculation.deleteMany({
        where: {
          id,
          userId: user.id,
        },
      })

      if (deleted.count === 0) {
        return NextResponse.json(
          { error: 'Calculation not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true })
    }

    // Otherwise clear all history for this user
    const deleted = await prisma.calculation.deleteMany({
      where: { userId: user.id },
    })

    await prisma.user.update({
      where: { id: user.id },
      data: {
        favoriteCategory: null,
        mostUsedCalculator: null,
      },
    })

    return NextResponse.json({ success: true, cleared: deleted.count })

  } catch (error) {
    console.error('History DELETE Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
76