const HTML_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"]/g, (ch) => HTML_ESCAPE[ch]!);
}

interface TokenRule {
  pattern: RegExp;
  className: string;
}

const RULES: TokenRule[] = [
  { pattern: /(\/\/[^\n]*)/g, className: 'token-comment' },
  { pattern: /(\/\*[\s\S]*?\*\/)/g, className: 'token-comment' },
  { pattern: /(`(?:[^`\\]|\\.)*`)/g, className: 'token-string' },
  { pattern: /("(?:[^"\\]|\\.)*")/g, className: 'token-string' },
  { pattern: /('(?:[^'\\]|\\.)*')/g, className: 'token-string' },
  {
    pattern:
      /(&lt;\/?(?:[A-Z][a-zA-Z.]*|[a-z][\w-]*|Fragment)[\s\S]*?\/?&gt;)/g,
    className: 'token-tag',
  },
  {
    pattern:
      /\b(const|let|var|function|import|export|return|if|else|for|while|class|extends|new|await|async|type|interface|enum|default|from|as)\b/g,
    className: 'token-keyword',
  },
  { pattern: /\b(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g, className: 'token-number' },
  { pattern: /\b([a-zA-Z_$]\w*)(?=\s*\()/g, className: 'token-function' },
];

interface Span {
  start: number;
  end: number;
  className: string;
}

function overlaps(a: Span, b: Span): boolean {
  return a.start < b.end && b.start < a.end;
}

export function highlightCode(code: string, _language: string): string {
  const escaped = escapeHtml(code);
  const spans: Span[] = [];

  for (const { pattern, className } of RULES) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(escaped)) !== null) {
      const span: Span = {
        start: match.index,
        end: match.index + match[0].length,
        className,
      };
      if (!spans.some((existing) => overlaps(existing, span))) {
        spans.push(span);
      }
    }
    pattern.lastIndex = 0;
  }

  spans.sort((a, b) => a.start - b.start);

  let result = '';
  let pos = 0;
  for (const { start, end, className } of spans) {
    result += escaped.slice(pos, start);
    result += `<span class="${className}">${escaped.slice(start, end)}</span>`;
    pos = end;
  }
  result += escaped.slice(pos);

  return result;
}
