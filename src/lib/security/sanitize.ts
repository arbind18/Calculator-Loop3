/**
 * Input Sanitization Utilities
 * Prevents XSS, SQL Injection, and other security threats
 */

/**
 * Sanitize string for safe display (removes HTML tags and dangerous characters)
 */
export function sanitizeText(input: string): string {
  if (!input) return '';

  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/data:text\/html/gi, '') // Remove data: protocol for HTML
    .trim();
}

/**
 * Sanitize HTML content (basic - for rich text use DOMPurify on client)
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  return html
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove object tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Remove embed tags
    .replace(/<embed\b[^<]*>/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol for scripts
    .replace(/data:text\/javascript/gi, '')
    .replace(/data:text\/html/gi, '');
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Unescape HTML entities
 */
export function unescapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
  };

  return text.replace(/&(amp|lt|gt|quot|#x27|#x2F);/g, (match) => map[match]);
}

/**
 * Sanitize URL to prevent XSS via href/src attributes
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const trimmedUrl = url.trim().toLowerCase();

  // Block dangerous protocols
  const dangerousProtocols = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:',
    'about:',
  ];

  for (const protocol of dangerousProtocols) {
    if (trimmedUrl.startsWith(protocol)) {
      return ''; // Return empty string for dangerous URLs
    }
  }

  // Only allow http, https, mailto, tel
  if (
    !trimmedUrl.startsWith('http://') &&
    !trimmedUrl.startsWith('https://') &&
    !trimmedUrl.startsWith('mailto:') &&
    !trimmedUrl.startsWith('tel:') &&
    !trimmedUrl.startsWith('/') &&
    !trimmedUrl.startsWith('#')
  ) {
    return ''; // Block unrecognized protocols
  }

  return url;
}

/**
 * Check for SQL injection patterns
 */
export function hasSqlInjection(input: string): boolean {
  const sqlPatterns = [
    // SQL commands
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
    // SQL comments
    /(--|\/\*|\*\/|#)/g,
    // SQL operators and conditions
    /(;|'|"|`)/g,
    // Union-based injection
    /(UNION\s+(ALL\s+)?SELECT)/gi,
    // OR-based injection
    /(\bOR\b\s+\d+\s*=\s*\d+|\bOR\b\s+'[^']*'\s*=\s*'[^']*')/gi,
    // AND-based injection
    /(\bAND\b\s+\d+\s*=\s*\d+|\bAND\b\s+'[^']*'\s*=\s*'[^']*')/gi,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Sanitize filename to prevent directory traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
    .replace(/\.{2,}/g, '.') // Replace multiple dots
    .replace(/^\.+/, '') // Remove leading dots
    .substring(0, 255); // Limit length
}

/**
 * Sanitize object keys and values recursively
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeText(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeText(key);
    sanitized[sanitizedKey] = sanitizeObject(value);
  }

  return sanitized;
}

/**
 * Remove null bytes from input
 */
export function removeNullBytes(input: string): string {
  return input.replace(/\0/g, '');
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[<>'"]/g, '');
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+\-() ]/g, '');
}

/**
 * Check for common XSS patterns
 */
export function hasXssPattern(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /on\w+\s*=/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /<object\b/gi,
    /<embed\b/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Comprehensive input validation and sanitization
 */
export function validateAndSanitizeInput(input: string): {
  valid: boolean;
  sanitized: string;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input || typeof input !== 'string') {
    return {
      valid: false,
      sanitized: '',
      errors: ['Invalid input type'],
    };
  }

  // Check for XSS
  if (hasXssPattern(input)) {
    errors.push('Potential XSS attack detected');
  }

  // Check for SQL injection
  if (hasSqlInjection(input)) {
    errors.push('Potential SQL injection detected');
  }

  // Sanitize the input
  const sanitized = sanitizeText(removeNullBytes(input));

  return {
    valid: errors.length === 0,
    sanitized,
    errors,
  };
}
