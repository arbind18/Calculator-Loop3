import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        key: true,
        tier: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
        expiresAt: true,
        _count: {
          select: {
            usage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Mask API keys (show only last 8 characters)
    const maskedKeys = apiKeys.map((key) => ({
      ...key,
      key: `${'*'.repeat(key.key.length - 8)}${key.key.slice(-8)}`,
      usageCount: key._count.usage,
    }));

    return NextResponse.json({
      success: true,
      apiKeys: maskedKeys,
    });
  } catch (error) {
    console.error('List API keys error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
