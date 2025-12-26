import { randomBytes } from 'crypto';

/**
 * CSRF (Cross-Site Request Forgery) Protection
 */

// Store CSRF tokens (in production, use Redis or database)
const csrfTokens = new Map<string, { token: string; createdAt: number }>();

// Token expiration time (30 minutes)
const TOKEN_EXPIRY = 30 * 60 * 1000;

/**
 * Generate a CSRF token for a session
 */
export function generateCsrfToken(sessionId: string): string {
  const token = randomBytes(32).toString('hex');

  // Store token with timestamp
  csrfTokens.set(sessionId, {
    token,
    createdAt: Date.now(),
  });

  // Clean up expired tokens
  cleanupExpiredTokens();

  return token;
}

/**
 * Verify CSRF token
 */
export function verifyCsrfToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);

  if (!stored) {
    return false;
  }

  // Check if token has expired
  if (Date.now() - stored.createdAt > TOKEN_EXPIRY) {
    csrfTokens.delete(sessionId);
    return false;
  }

  // Verify token matches
  return stored.token === token;
}

/**
 * Remove CSRF token after use (optional, depends on your use case)
 */
export function removeCsrfToken(sessionId: string): void {
  csrfTokens.delete(sessionId);
}

/**
 * Clean up expired tokens
 */
function cleanupExpiredTokens(): void {
  const now = Date.now();

  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now - data.createdAt > TOKEN_EXPIRY) {
      csrfTokens.delete(sessionId);
    }
  }
}

/**
 * Get CSRF token from request headers
 */
export function getCsrfTokenFromHeaders(headers: Headers): string | null {
  return (
    headers.get('X-CSRF-Token') ||
    headers.get('X-XSRF-Token') ||
    null
  );
}

/**
 * Create CSRF middleware for API routes
 */
export function withCsrfProtection(
  sessionId: string,
  token: string | null
): { valid: boolean; error?: string } {
  if (!token) {
    return { valid: false, error: 'CSRF token is required' };
  }

  if (!verifyCsrfToken(sessionId, token)) {
    return { valid: false, error: 'Invalid or expired CSRF token' };
  }

  return { valid: true };
}
