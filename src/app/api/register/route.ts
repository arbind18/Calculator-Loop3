import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { 
  registrationSchema, 
  validateAndSanitize,
} from "@/lib/security/validation"
import { 
  getClientIdentifier, 
  withRateLimit 
} from "@/lib/security/rateLimit"
import { hasSqlInjection, hasXssPattern, sanitizeEmail } from "@/lib/security/sanitize"

export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(req)
    const rateLimit = withRateLimit(clientId, 'register')
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: rateLimit.error },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter),
          }
        }
      )
    }

    const body = await req.json()

    // Validate input
    const validation = validateAndSanitize(registrationSchema, body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const { email, password, name } = validation.data

    // Additional security checks
    if (hasSqlInjection(email) || hasSqlInjection(name)) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400 }
      )
    }

    if (hasXssPattern(name)) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400 }
      )
    }

    // Check if user exists
    const exists = await prisma.user.findUnique({
      where: {
        email: sanitizeEmail(email),
      },
    })

    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12) // Increased rounds for better security

    // Create user
    const user = await prisma.user.create({
      data: {
        email: sanitizeEmail(email),
        name: name.trim(),
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("[REGISTER_ERROR]", error)

    const message = (() => {
      const err = error as any
      const name = typeof err?.name === 'string' ? err.name : ''
      const code = typeof err?.code === 'string' ? err.code : ''

      // Prisma initialization/connectivity issues are common in production when DATABASE_URL is missing
      // or when using SQLite on a serverless platform.
      if (
        name.includes('PrismaClientInitializationError') ||
        name.includes('PrismaClientKnownRequestError') ||
        code.startsWith('P1') ||
        code.startsWith('P2')
      ) {
        return 'Database is not configured for production. Please set a persistent DATABASE_URL and run Prisma migrations.'
      }

      return 'Internal server error'
    })()

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
