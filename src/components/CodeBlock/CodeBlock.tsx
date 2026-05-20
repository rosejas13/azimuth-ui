'use client';

import { type ComponentPropsWithoutRef, forwardRef, useState, useCallback } from 'react';
import { cn } from '@/utils/cn';
import styles from './CodeBlock.module.css';

/** Props for the CodeBlock component. */
export interface CodeBlockProps extends Omit<ComponentPropsWithoutRef<'pre'>, 'children'> {
  /** The source code string to display. */
  code: string;
  /** The programming language for labeling. */
  language?: string;
  /** Whether to show line numbers. @default false */
  showLineNumbers?: boolean;
  /** Whether to show a copy button. @default false */
  showCopyButton?: boolean;
  /** Maximum height of the code block (CSS value). */
  maxHeight?: string;
}

export const CodeBlock = forwardRef<HTMLPreElement, CodeBlockProps>(
  (
    {
      code,
      language,
      showLineNumbers = false,
      showCopyButton = false,
      maxHeight,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }, [code]);

    const lines = code.split('\n');

    return (
      <pre
        ref={ref}
        className={cn(styles.root, showLineNumbers && styles.withLineNumbers, className)}
        style={{ ...style, maxHeight: maxHeight || undefined }}
        aria-label="Code block"
        {...props}
      >
        <div className={styles.header}>
          {language && <span className={styles.language}>{language}</span>}
          {showCopyButton && (
            <button
              type="button"
              className={styles.copyBtn}
              onClick={handleCopy}
              aria-label={copied ? 'Copied!' : 'Copy code'}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        <code className={styles.code}>
          {lines.map((line, i) => (
            <span key={i} className={styles.line}>
              {showLineNumbers && (
                <span className={styles.lineNumber} aria-hidden="true">
                  {i + 1}
                </span>
              )}
              <span className={styles.lineContent}>{line || '\u00A0'}</span>
            </span>
          ))}
        </code>
      </pre>
    );
  },
);

CodeBlock.displayName = 'CodeBlock';
