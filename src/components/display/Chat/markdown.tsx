import { type ReactNode, Fragment } from 'react';
import styles from './Chat.module.css';

/**
 * A minimal, dependency-free Markdown renderer for chat bubbles.
 *
 * It parses a safe subset (paragraphs, unordered/ordered lists, fenced code
 * blocks, inline code, bold, italic, and links) into React elements. It never
 * uses dangerouslySetInnerHTML: every piece of message text becomes a React
 * text node, which React escapes, so raw HTML such as `<script>` or
 * `<img onerror>` in model output is rendered as literal text and cannot
 * execute. Link hrefs are scheme-checked so `javascript:` (and other unsafe
 * schemes) are stripped and rendered as plain text instead of a live link.
 *
 * This intentionally does not aim for full CommonMark coverage; consumers who
 * need that can pass `renderMessage` and inject their own renderer.
 */
export function renderMarkdown(src: string): ReactNode {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block: ```...```
    if (/^\s*```/.test(line)) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++; // consume the closing fence (if present)
      blocks.push(
        <pre key={key++} className={styles.pre}>
          <code>{code.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ''));
        i++;
      }
      const lk = key++;
      blocks.push(
        <ul key={lk} className={styles.mdList}>
          {items.map((item, idx) => (
            <li key={idx}>{parseInline(item, `${lk}-li-${idx}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      const lk = key++;
      blocks.push(
        <ol key={lk} className={styles.mdList}>
          {items.map((item, idx) => (
            <li key={idx}>{parseInline(item, `${lk}-oli-${idx}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Paragraph: gather consecutive non-blank, non-block lines.
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^\s*```/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    const pk = key++;
    blocks.push(
      <p key={pk} className={styles.mdParagraph}>
        {para.map((l, idx) => (
          <Fragment key={idx}>
            {idx > 0 && <br />}
            {parseInline(l, `${pk}-${idx}`)}
          </Fragment>
        ))}
      </p>,
    );
  }

  return blocks;
}

const INLINE_SOURCE = [
  '(`([^`]+)`)', // 1,2  inline code
  '(\\*\\*([\\s\\S]+?)\\*\\*)', // 3,4  bold
  '(\\*([\\s\\S]+?)\\*)', // 5,6  italic (*)
  '(_([\\s\\S]+?)_)', // 7,8  italic (_)
  '(\\[([^\\]]+)\\]\\(([^)]+)\\))', // 9,10 label, 11 url  link
].join('|');

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  let m: RegExpExecArray | null;
  // A fresh regex per call: parseInline recurses, and a shared global regex's
  // lastIndex would be clobbered by inner calls, corrupting this loop.
  const inline = new RegExp(INLINE_SOURCE, 'g');

  while ((m = inline.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyPrefix}-${n++}`;

    if (m[2] !== undefined) {
      out.push(
        <code key={key} className={styles.code}>
          {m[2]}
        </code>,
      );
    } else if (m[4] !== undefined) {
      out.push(<strong key={key}>{parseInline(m[4], key)}</strong>);
    } else if (m[6] !== undefined) {
      out.push(<em key={key}>{parseInline(m[6], key)}</em>);
    } else if (m[8] !== undefined) {
      out.push(<em key={key}>{parseInline(m[8], key)}</em>);
    } else if (m[10] !== undefined) {
      const href = sanitizeHref(m[11]);
      const label = parseInline(m[10], key);
      out.push(
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            {label}
          </a>
        ) : (
          <Fragment key={key}>{label}</Fragment>
        ),
      );
    }
    last = inline.lastIndex;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

const ALLOWED_SCHEMES = ['http', 'https', 'mailto', 'tel'];

/**
 * Returns a safe href, or `undefined` if the URL uses a disallowed scheme.
 * Control characters and spaces are stripped first (by code point, so no
 * control-character literals appear in source) so tricks like `java\tscript:`
 * cannot slip a dangerous scheme past the scheme check.
 */
export function sanitizeHref(url: string): string | undefined {
  const cleaned = url
    .split('')
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code > 0x20 && code !== 0x7f;
    })
    .join('');
  const scheme = cleaned.match(/^([a-z][a-z0-9+.-]*):/i);
  if (scheme && !ALLOWED_SCHEMES.includes(scheme[1].toLowerCase())) {
    return undefined;
  }
  return cleaned;
}
