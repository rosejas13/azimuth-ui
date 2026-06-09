type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

function toValue(input: ClassValue): string {
  if (typeof input === 'string' || typeof input === 'number') {
    return String(input);
  }

  if (input === null || input === undefined || input === false) {
    return '';
  }

  if (Array.isArray(input)) {
    let result = '';
    for (const item of input) {
      const value = toValue(item);
      if (value) {
        result += (result ? ' ' : '') + value;
      }
    }
    return result;
  }

  if (typeof input === 'object') {
    let result = '';
    for (const [key, value] of Object.entries(input)) {
      if (value) {
        result += (result ? ' ' : '') + key;
      }
    }
    return result;
  }

  return '';
}

/**
 * Merges class names with support for strings, arrays, and object syntax.
 * Inspired by clsx/classnames — filters falsy values and joins with spaces.
 *
 * @param inputs - Class values to merge (strings, numbers, arrays, or objects).
 * @returns A single space-separated class string.
 */
export function cn(...inputs: ClassValue[]): string {
  let result = '';
  for (const input of inputs) {
    const value = toValue(input);
    if (value) {
      result += (result ? ' ' : '') + value;
    }
  }
  return result;
}
