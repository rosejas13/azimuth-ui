const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Token replacements, longest-first. Mirrors the date-fns tokens consumers
 * expect: yyyy/yy, MMMM/MMM/MM/M, dd/d.
 */
const TOKENS: Record<string, (date: Date) => string> = {
  yyyy: (d) => String(d.getFullYear()),
  yy: (d) => pad(d.getFullYear() % 100),
  MMMM: (d) => d.toLocaleDateString('en-US', { month: 'long' }),
  MMM: (d) => d.toLocaleDateString('en-US', { month: 'short' }),
  MM: (d) => pad(d.getMonth() + 1),
  dd: (d) => pad(d.getDate()),
  M: (d) => String(d.getMonth() + 1),
  d: (d) => String(d.getDate()),
};

const TOKEN_PATTERN = /yyyy|MMMM|MMM|MM|yy|dd|M|d/g;

/**
 * Formats a Date to a string using a format token pattern.
 *
 * Supported tokens:
 * - `yyyy` → `2026`, `yy` → `26`
 * - `MMMM` → `January`, `MMM` → `Jan`, `MM` → `01`, `M` → `1`
 * - `dd` → `01`, `d` → `1`
 *
 * Legacy presets still work: `P` (numeric), `PP` (abbreviated), `PPP`
 * (full month, default). Unknown formats fall back to `PPP`.
 *
 * @example
 * formatDate(date, 'MM-dd-yy')   // '08-25-26'
 * formatDate(date, 'MM dd yyyy') // '08 25 2026'
 */
export function formatDate(date: Date, formatStr = 'PPP'): string {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
  const monthLong = date.toLocaleDateString('en-US', { month: 'long' });

  switch (formatStr) {
    case 'P':
      return `${month}/${day}/${year}`;
    case 'PP':
      return `${monthShort} ${date.getDate()}, ${year}`;
    case 'PPP':
      return `${monthLong} ${date.getDate()}, ${year}`;
  }

  if (!/[yMd]/.test(formatStr)) {
    return `${monthLong} ${date.getDate()}, ${year}`;
  }

  return formatStr.replace(TOKEN_PATTERN, (token) => TOKENS[token](date));
}
