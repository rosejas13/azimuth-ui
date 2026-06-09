/**
 * Formats a Date to a string using a simple format token.
 *
 * Supported tokens:
 * - `P` → `01/01/2026` (numeric)
 * - `PP` → `Jan 1, 2026` (abbreviated month)
 * - `PPP` → `January 1, 2026` (full month, default)
 * - `yyyy-MM-dd` → `2026-01-01` (ISO)
 *
 * Unknown formats fall back to `PPP`.
 */
export function formatDate(date: Date, formatStr = 'PPP'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
  const monthLong = date.toLocaleDateString('en-US', { month: 'long' });

  switch (formatStr) {
    case 'P':
      return `${month}/${day}/${year}`;
    case 'PP':
      return `${monthShort} ${date.getDate()}, ${year}`;
    case 'PPP':
      return `${monthLong} ${date.getDate()}, ${year}`;
    case 'yyyy-MM-dd':
      return `${year}-${month}-${day}`;
    default:
      return `${monthLong} ${date.getDate()}, ${year}`;
  }
}
