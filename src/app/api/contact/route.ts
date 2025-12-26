import { NextResponse } from 'next/server';
import {
  contactSchema,
  validateAndSanitize,
} from '@/lib/security/validation';
import { getClientIdentifier, withRateLimit } from '@/lib/security/rateLimit';
import { hasSqlInjection, hasXssPattern, sanitizeEmail } from '@/lib/security/sanitize';

export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(req);
    const rateLimit = withRateLimit(clientId, 'contact');

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: rateLimit.error },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter),
          },
        }
      );
    }

    const body = await req.json();

    // Validate input
    const validation = validateAndSanitize(contactSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;

    // Additional security checks
    if (hasSqlInjection(name) || hasSqlInjection(subject) || hasSqlInjection(message)) {
      return NextResponse.json({ error: 'Invalid input detected' }, { status: 400 });
    }

    if (hasXssPattern(name) || hasXssPattern(subject) || hasXssPattern(message)) {
      return NextResponse.json({ error: 'Invalid input detected' }, { status: 400 });
    }

    // TODO: Send email using Resend or save to database
    // For now, just log the contact form submission
    console.log('[CONTACT_FORM]', {
      name: name.trim(),
      email: sanitizeEmail(email),
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    });

    // You can integrate with Resend here
    // await resend.emails.send({
    //   from: 'contact@calculatorloop.com',
    //   to: 'support@calculatorloop.com',
    //   subject: `Contact Form: ${subject}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>From:</strong> ${name} (${email})</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('[CONTACT_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
