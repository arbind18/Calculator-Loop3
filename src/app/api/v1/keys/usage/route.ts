import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getApiUsageStats } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const keyId = url.searchParams.get('keyId');
    const days = parseInt(url.searchParams.get('days') || '30');

    if (!keyId) {
      return NextResponse.json({ error: 'Key ID is required' }, { status: 400 });
    }

    // Verify the key belongs to the user
    const apiKey = await prisma.apiKey.findUnique({
      where: { id: keyId },
    });

    if (!apiKey || apiKey.userId !== session.user.id) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    // Get usage statistics
    const stats = await getApiUsageStats(keyId, days);

    return NextResponse.json({
      success: true,
      usage: stats,
    });
  } catch (error) {
    console.error('Get API usage error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
