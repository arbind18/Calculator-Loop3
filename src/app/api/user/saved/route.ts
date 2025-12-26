import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
async function refreshSignalsFromSaved(userId: string) {
  const byCalculator = await prisma.savedResult.groupBy({
    by: ['calculatorType'],
    where: { userId },
    _count: { _all: true },
    orderBy: { _count: { calculatorType: 'desc' } },
    take: 1,
  })

  await prisma.user.update({
    where: { id: userId },
    data: {
      mostUsedCalculator: byCalculator[0]?.calculatorType ?? undefined,
    },
  })
}

// GET - Fetch saved results
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

    const savedResults = await prisma.savedResult.findMany({
      where: { userId: user.id },
      orderBy: { savedAt: 'desc' }
    })

    const parsedSavedResults = savedResults.map(res => ({
      ...res,
      inputs: typeof res.inputs === 'string' ? JSON.parse(res.inputs) : res.inputs,
      result: typeof res.result === 'string' ? JSON.parse(res.result) : res.result,
      tags: res.tags && typeof res.tags === 'string' ? JSON.parse(res.tags) : (res.tags || [])
    }))

    return NextResponse.json({ savedResults: parsedSavedResults })

  } catch (error) {
    console.error('Saved Results GET Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Save calculation result
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

    const { calculatorType, calculatorName, inputs, result, notes, tags } = await request.json()

    const savedResult = await prisma.savedResult.create({
      data: {
        userId: user.id,
        calculatorType,
        calculatorName,
        inputs: JSON.stringify(inputs),
        result: JSON.stringify(result),
        notes: notes || '',
        tags: JSON.stringify(tags || [])
      }
    })

      // Preference signals (only if user opted in)
      if (user.personalizationOptIn) {
        await refreshSignalsFromSaved(user.id)
      }

    return NextResponse.json({ 
      success: true, 
      savedResult: {
        ...savedResult,
        inputs,
        result,
        tags: tags || []
      }
    })

  } catch (error) {
    console.error('Saved Results POST Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update saved result (notes/tags)
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
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { id, notes, tags } = await request.json()

    const updated = await prisma.savedResult.update({
      where: {
        id,
        userId: user.id
      },
      data: {
        notes,
        tags: tags ? JSON.stringify(tags) : undefined
      }
    })

    return NextResponse.json({ 
      success: true, 
      savedResult: {
        ...updated,
        inputs: typeof updated.inputs === 'string' ? JSON.parse(updated.inputs) : updated.inputs,
        result: typeof updated.result === 'string' ? JSON.parse(updated.result) : updated.result,
        tags: updated.tags && typeof updated.tags === 'string' ? JSON.parse(updated.tags) : (updated.tags || [])
      }
    })

  } catch (error) {
    console.error('Saved Results PATCH Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove saved result
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

    if (!id) {
      return NextResponse.json(
        { error: 'Result ID required' },
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

    await prisma.savedResult.delete({
      where: {
        id,
        userId: user.id
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Saved Results DELETE Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
