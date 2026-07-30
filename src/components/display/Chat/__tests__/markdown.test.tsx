import { describe, it, expect } from 'vitest';
import { sanitizeHref } from '../markdown';

describe('sanitizeHref', () => {
  it('allows http, https, mailto, and tel', () => {
    expect(sanitizeHref('https://example.com')).toBe('https://example.com');
    expect(sanitizeHref('http://example.com')).toBe('http://example.com');
    expect(sanitizeHref('mailto:a@b.com')).toBe('mailto:a@b.com');
    expect(sanitizeHref('tel:+15551234')).toBe('tel:+15551234');
  });

  it('allows scheme-less (relative) URLs', () => {
    expect(sanitizeHref('/docs')).toBe('/docs');
    expect(sanitizeHref('#anchor')).toBe('#anchor');
    expect(sanitizeHref('page/thing')).toBe('page/thing');
  });

  it('rejects javascript: and other unsafe schemes', () => {
    expect(sanitizeHref('javascript:alert(1)')).toBeUndefined();
    expect(sanitizeHref('data:text/html,<script>')).toBeUndefined();
    expect(sanitizeHref('vbscript:msgbox')).toBeUndefined();
  });

  it('defeats control-character obfuscation of the scheme', () => {
    // Tab / newline inside "javascript:" must not sneak past the check.
    expect(sanitizeHref('java\tscript:alert(1)')).toBeUndefined();
    expect(sanitizeHref('java\nscript:alert(1)')).toBeUndefined();
    expect(sanitizeHref('  javascript:alert(1)')).toBeUndefined();
  });
});
