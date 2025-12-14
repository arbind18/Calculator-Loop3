import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { existingLoan, existingEMI, topUpAmount, interestRate, tenure } = body;

    const calculation = await prisma.topUpLoanCalculation.create({
      data: {
        existingLoan: parseFloat(existingLoan),
        existingEMI: parseFloat(existingEMI),
        topUpAmount: parseFloat(topUpAmount),
        interestRate: parseFloat(interestRate),
        tenure: parseInt(tenure),
      },
    });

    return NextResponse.json({ success: true, data: calculation });
  } catch (error) {
    console.error('Error saving calculation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save calculation' },
      { status: 500 }
    );
  }
}
