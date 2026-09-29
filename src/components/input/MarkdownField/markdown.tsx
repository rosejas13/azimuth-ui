import { Fragment, type ReactNode } from 'react';
import styles from './MarkdownField.module.css';

/**
 * Dependency-free Markdown-to-React renderer used by MarkdownField previews.
 *
 * Safety model: nothing here emits HTML. The source is tokenized and rebuilt
 * as React nodes, so every piece of author text becomes a React text node
 * that React escapes by construction. Raw HTML such as `<script>` or
 * `<img onerror>` renders as literal text and cannot execute.
 *
 * Supported: headings (#..######), bold, italic (* and _), inline code,
 * fenced code blocks, links, unordered/ordered lists, blockquotes,
 * paragraphs, and hard breaks (each newline inside a paragraph renders as
 * `<br />`). Anything else — images, tables, nested lists, reference links —
 * degrades to plain text.
 */
export function parseMarkdown(md: string): ReactNode {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block: ``` ... ``` (unclosed fences are tolerated).
    if (/^\s*```/.test(line)) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++; // consume the closing fence, if present
      blocks.push(
        <pre key={key++} className={styles.mdCodeBlock}>
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

    // ATX heading: # .. ######
    const heading = line.match(/^ {0,3}(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (heading) {
      const level = heading[1].length;
      const content = parseInline(heading[2], `${key}-h`);
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      blocks.push(
        <Tag key={key++} className={styles[`mdH${level}`]}>
          {content}
        </Tag>,
      );
      i++;
      continue;
    }

    // Blockquote: consecutive `> ...` lines form one quote.
    if (/^ {0,3}>/.test(line)) {
      const quoted: string[] = [];
      while (i < lines.length && /^ {0,3}>/.test(lines[i])) {
        quoted.push(lines[i].replace(/^ {0,3}>\s?/, ''));
        i++;
      }
      const qk = key++;
      blocks.push(
        <blockquote key={qk} className={styles.mdQuote}>
          {quoted.map((q, idx) => (
            <Fragment key={idx}>
              {idx > 0 && <br />}
              {parseInline(q, `${qk}-q-${idx}`)}
            </Fragment>
          ))}
        </blockquote>,
      );
      continue;
    }

    // Unordered list
    if (/^ {0,3}[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^ {0,3}[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^ {0,3}[-*+]\s+/, ''));
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
    if (/^ {0,3}\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^ {0,3}\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^ {0,3}\d+\.\s+/, ''));
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

    // Paragraph: gather consecutive non-blank, non-block lines; every newline
    // inside a paragraph renders as a hard break (<br />).
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^ {0,3}(```|>|[-*+]\s|\d+\.\s)/.test(lines[i])
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

/**
 * Inline alternatives (in priority order):
 * 1 image syntax is consumed and emitted as literal text (media-less),
 * 2,3 inline code, 4,5 bold, 6,7 italic (*), 8,9 italic (_),
 * 10,11,12 link [label](url).
 */
const INLINE_SOURCE = [
  '(!\\[[^\\]\\n]*\\]\\([^)\\n]*\\))', // 1  image → plain text
  '(`([^`\\n]+)`)', // 2,3  inline code
  '(\\*\\*([^*]+)\\*\\*)', // 4,5  bold
  '(\\*([^*\\n]+)\\*)', // 6,7  italic (*)
  '(_([^_\\n]+)_)', // 8,9  italic (_)
  '(\\[([^\\]\\n]+)\\]\\(([^)\\n]+)\\))', // 10,11 label, 12 url
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

    if (m[1] !== undefined) {
      // Images are not supported media-free markup: render the source verbatim.
      out.push(m[1]);
    } else if (m[3] !== undefined) {
      out.push(
        <code key={key} className={styles.mdInlineCode}>
          {m[3]}
        </code>,
      );
    } else if (m[5] !== undefined) {
      out.push(<strong key={key}>{parseInline(m[5], key)}</strong>);
    } else if (m[7] !== undefined) {
      out.push(<em key={key}>{parseInline(m[7], key)}</em>);
    } else if (m[9] !== undefined) {
      out.push(<em key={key}>{parseInline(m[9], key)}</em>);
    } else if (m[11] !== undefined) {
      const href = safeHref(m[12]);
      const label = parseInline(m[11], key);
      out.push(
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mdLink}
          >
            {label}
          </a>
        ) : (
          // Unsafe scheme (or no scheme): the link markup is dropped and the
          // label degrades to plain text.
          <Fragment key={key}>{label}</Fragment>
        ),
      );
    }
    last = m.index + m[0].length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Only remote and mail headers may become live links in the preview. */
const ALLOWED_SCHEMES = ['http', 'https', 'mailto'];

/**
 * Returns a safe href, or `undefined` when the URL must not be linked.
 * Scheme-less URLs are rejected; only `http:`, `https:` and `mailto:` pass.
 * Control characters, spaces and DEL are stripped first (by code point, so no
 * control-character literals appear in source) so obfuscation like
 * `java\tscript:` cannot slip a dangerous scheme past the check.
 */
export function safeHref(url: string): string | undefined {
  const cleaned = url
    .split('')
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code > 0x20 && code !== 0x7f;
    })
    .join('');
  const scheme = cleaned.match(/^([a-z][a-z0-9+.-]*):/i);
  if (!scheme || !ALLOWED_SCHEMES.includes(scheme[1].toLowerCase())) {
    return undefined;
  }
  return cleaned;
}
