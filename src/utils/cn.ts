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
