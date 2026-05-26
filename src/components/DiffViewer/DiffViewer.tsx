'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useMemo,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './DiffViewer.module.css';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  oldLine?: number;
  newLine?: number;
}

function computeDiff(
  oldLines: string[],
  newLines: string[],
): DiffLine[] {
  const m = oldLines.length;
  const n = newLines.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: n + 1 }, () => 0),
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      oldLines[i - 1] === newLines[j - 1]
    ) {
      result.unshift({
        type: 'unchanged',
        content: oldLines[i - 1],
        oldLine: i,
        newLine: j,
      });
      i--;
      j--;
    } else if (
      j > 0 &&
      (i === 0 || dp[i][j - 1] >= dp[i - 1][j])
    ) {
      result.unshift({
        type: 'added',
        content: newLines[j - 1],
        newLine: j,
      });
      j--;
    } else {
      result.unshift({
        type: 'removed',
        content: oldLines[i - 1],
        oldLine: i,
      });
      i--;
    }
  }

  return result;
}

export interface DiffViewerProps extends ComponentPropsWithoutRef<'div'> {
  oldCode: string;
  newCode: string;
  language?: string;
  /** @default true */
  showLineNumbers?: boolean;
  /** @default false */
  splitView?: boolean;
  maxHeight?: string;
}

export const DiffViewer = forwardRef<HTMLDivElement, DiffViewerProps>(
  (
    {
      oldCode,
      newCode,
      language,
      showLineNumbers = true,
      splitView = false,
      maxHeight,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const oldLines = useMemo(() => oldCode.split('\n'), [oldCode]);
    const newLines = useMemo(() => newCode.split('\n'), [newCode]);

    const diff = useMemo(
      () => computeDiff(oldLines, newLines),
      [oldLines, newLines],
    );

    const stats = useMemo(() => {
      let additions = 0;
      let deletions = 0;
      for (const line of diff) {
        if (line.type === 'added') additions++;
        if (line.type === 'removed') deletions++;
      }
      return { additions, deletions };
    }, [diff]);

    if (splitView) {
      const oldColumn: DiffLine[] = [];
      const newColumn: DiffLine[] = [];
      let oldNum = 1;
      let newNum = 1;

      for (const line of diff) {
        if (line.type === 'unchanged') {
          oldColumn.push({ ...line, oldLine: oldNum, newLine: newNum });
          newColumn.push({ ...line, oldLine: oldNum, newLine: newNum });
          oldNum++;
          newNum++;
        } else if (line.type === 'removed') {
          oldColumn.push({ ...line, oldLine: oldNum });
          newColumn.push({
            type: 'unchanged',
            content: '',
            newLine: newNum,
          });
          oldNum++;
        } else {
          oldColumn.push({
            type: 'unchanged',
            content: '',
            oldLine: oldNum,
          });
          newColumn.push({ ...line, newLine: newNum });
          newNum++;
        }
      }

      return (
        <div
          ref={ref}
          className={cn(styles.root, className)}
          style={{ ...style, maxHeight }}
          {...props}
        >
          <div className={styles.header}>
            {language && (
              <span className={styles.language}>{language}</span>
            )}
            <span className={styles.additions}>
              +{stats.additions}
            </span>
            <span className={styles.deletions}>
              -{stats.deletions}
            </span>
          </div>
          <div className={styles.codeArea}>
            <div className={styles.splitView}>
              <div className={styles.splitColumn}>
                <div className={styles.columnHeader}>Old</div>
                {oldColumn.map((line, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      styles.line,
                      line.type === 'removed' && styles.removed,
                    )}
                  >
                    {showLineNumbers && (
                      <span className={styles.lineNum}>
                        {line.oldLine ?? ''}
                      </span>
                    )}
                    <span className={styles.content}>
                      <span className={styles.prefix}>
                        {line.type === 'removed' ? '-' : ' '}
                      </span>
                      {line.content || '\u00A0'}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.splitColumn}>
                <div className={styles.columnHeader}>New</div>
                {newColumn.map((line, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      styles.line,
                      line.type === 'added' && styles.added,
                    )}
                  >
                    {showLineNumbers && (
                      <span className={styles.lineNum}>
                        {line.newLine ?? ''}
                      </span>
                    )}
                    <span className={styles.content}>
                      <span className={styles.prefix}>
                        {line.type === 'added' ? '+' : ' '}
                      </span>
                      {line.content || '\u00A0'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(styles.root, className)}
        style={{ ...style, maxHeight }}
        {...props}
      >
        <div className={styles.header}>
          {language && (
            <span className={styles.language}>{language}</span>
          )}
          <span className={styles.additions}>+{stats.additions}</span>
          <span className={styles.deletions}>-{stats.deletions}</span>
        </div>
        <div className={styles.codeArea}>
          {diff.map((line, idx) => (
            <div
              key={idx}
              className={cn(
                styles.line,
                line.type === 'added' && styles.added,
                line.type === 'removed' && styles.removed,
              )}
            >
              {showLineNumbers && (
                <span className={styles.lineNum}>
                  {line.type === 'added' ? '' : line.oldLine ?? ''}
                </span>
              )}
              {showLineNumbers && (
                <span className={styles.lineNum}>
                  {line.type === 'removed' ? '' : line.newLine ?? ''}
                </span>
              )}
              <span className={styles.content}>
                <span className={styles.prefix}>
                  {line.type === 'added'
                    ? '+'
                    : line.type === 'removed'
                      ? '-'
                      : ' '}
                </span>
                {line.content || ' '}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

DiffViewer.displayName = 'DiffViewer';
