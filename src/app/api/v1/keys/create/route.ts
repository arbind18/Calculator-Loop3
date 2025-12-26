import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateApiKey } from '@/lib/apiAuth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, tier = 'FREE', expiresInDays } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Key name is required' }, { status: 400 });
    }

    // Check if user already has maximum keys for their tier
    const existingKeys = await prisma.apiKey.count({
      where: {
        userId: session.user.id,
        isActive: true,
      },
    });

    const maxKeys = tier === 'FREE' ? 2 : tier === 'BASIC' ? 5 : 10;
    if (existingKeys >= maxKeys) {
      return NextResponse.json(
        { error: `Maximum ${maxKeys} active keys allowed for ${tier} tier` },
        { status: 400 }
      );
    }

    // Generate new API key
    const key = generateApiKey();

    // Calculate expiration date if provided
    let expiresAt = null;
    if (expiresInDays && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Create API key in database
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        key,
        tier,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.key, // Only show key on creation
        tier: apiKey.tier,
        createdAt: apiKey.createdAt,
        expiresAt: apiKey.expiresAt,
      },
    });
  } catch (error) {
    console.error('Create API key error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
