'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import { useInputConfig } from '../input-config';
import styles from './MarkdownField.module.css';
import { parseMarkdown } from './markdown';

export type MarkdownFieldMode = 'write' | 'preview' | 'split';

/**
 * One toolbar formatting action: `before`/`after` markers are inserted
 * around the textarea selection (or at the caret when nothing is selected).
 */
export interface ToolbarAction {
  /** Accessible name for the button. */
  label: string;
  /** Visible glyph. Media text glyphs only (B, I, </>, Link, •). */
  glyph: string;
  /** Marker inserted before the selection. */
  before: string;
  /** Marker inserted after the selection. @default before */
  after?: string;
}

/** Default toolbar: bold, italic, inline code, link, bullet list. */
export const DEFAULT_TOOLBAR_ACTIONS: ToolbarAction[] = [
  { glyph: 'B', label: 'Bold', before: '**', after: '**' },
  { glyph: 'I', label: 'Italic', before: '*', after: '*' },
  { glyph: '</>', label: 'Code', before: '`', after: '`' },
  { glyph: 'Link', label: 'Link', before: '[', after: '](https://)' },
  { glyph: '•', label: 'Bulleted list', before: '- ', after: '' },
];

/**
 * Curated native surface for the textarea editor pane. Anything native not
 * listed goes through `textareaProps`.
 */
export interface MarkdownFieldProps extends CuratedSurface<
  'textarea',
  [
    'className',
    'id',
    'name',
    'placeholder',
    'autoFocus',
    'readOnly',
    'spellCheck',
    'rows',
    'wrap',
    'tabIndex',
    'maxLength',
    'aria-describedby',
    'aria-invalid',
    'aria-label',
    'aria-labelledby',
    'onFocus',
    'onBlur',
    'onKeyDown',
    'onKeyUp',
    'onPaste',
    'onInput',
  ]
> {
  /** Label text above the editor (label wiring and styling parity with TextArea). */
  label?: string;
  /** Helper text rendered below the label. */
  subtitle?: string;
  /** Validation error rendered below the editor; sets `aria-invalid`. */
  error?: string;
  /** Controlled markdown source. Pair with `onChange`. Uncontrolled when omitted. */
  value?: string;
  /** Initial value for an uncontrolled editor. Ignored while `value` is set. */
  defaultValue?: string;
  /** Called with the full markdown string on every edit. */
  onChange?: (value: string) => void;
  /** @default false */
  disabled?: boolean;
  /** @default false */
  required?: boolean;
  /** Height of the editor and preview surfaces, in text lines. */
  rows?: number;
  /** Current mode. Uncontrolled when omitted; switches via the built-in toggle. @default 'write' */
  mode?: MarkdownFieldMode;
  /** Uncontrolled initial mode. Ignored while `mode` is set. @default 'write' */
  defaultMode?: MarkdownFieldMode;
  /** Called when the user switches modes via the built-in toggle. */
  onModeChange?: (mode: MarkdownFieldMode) => void;
  /** Hide the built-in Write/Preview/Split toggle (consumer-driven `mode`). @default true */
  modeSwitch?: boolean;
  /** @default true */
  toolbar?: boolean;
  /** Replaces the default bold/italic/code/link/list buttons when provided. */
  toolbarActions?: ToolbarAction[];
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Maximum character length. Enables the counter with `showCharCount`. */
  maxLength?: number;
  /** Live `n/maxLength` character counter. Requires `maxLength`. @default false */
  showCharCount?: boolean;
  /** Styling pass-through onto the preview container. */
  previewClassName?: string;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  textareaProps?: NativeRest<'textarea'>;
  /** Styling for the outer wrapper `<div>`. */
  wrapperClassName?: string;
}

const MODE_ORDER: MarkdownFieldMode[] = ['write', 'preview', 'split'];

const MODE_LABELS: Record<MarkdownFieldMode, string> = {
  write: 'Write',
  preview: 'Preview',
  split: 'Split',
};

/** Markdown editor with a rendered preview: write, preview, or split columns. */
export const MarkdownField = forwardRef<
  HTMLTextAreaElement,
  MarkdownFieldProps
>(function MarkdownField(
  {
    label,
    subtitle,
    error,
    required = false,
    value,
    defaultValue,
    onChange,
    disabled = false,
    readOnly = false,
    rows,
    mode,
    defaultMode = 'write',
    onModeChange,
    modeSwitch = true,
    toolbar = true,
    toolbarActions,
    size,
    maxLength,
    showCharCount = false,
    className,
    previewClassName,
    wrapperClassName,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    id,
    textareaProps,
    ...props
  },
  ref,
) {
  const { size: configSize, flushed } = useInputConfig();
  const resolvedSize = size ?? configSize ?? 'md';
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = (ref ||
    internalRef) as React.RefObject<HTMLTextAreaElement>;
  const generatedId = useId();
  const fieldId = id || generatedId;

  const isControlled = value !== undefined;
  const [localValue, setLocalValue] = useState<string>(() =>
    isControlled ? (value ?? '') : (defaultValue ?? ''),
  );
  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value, isControlled]);

  /** Latest value, readable inside stable toolbar callbacks. */
  const valueRef = useRef(localValue);
  valueRef.current = localValue;

  /** The uncontrolled-internal mode; ignored whenever `mode` is set. */
  const [internalMode, setInternalMode] =
    useState<MarkdownFieldMode>(defaultMode);
  const currentMode = mode ?? internalMode;
  const handleModeChange = useCallback(
    (next: MarkdownFieldMode) => {
      if (mode === undefined) {
        setInternalMode(next);
      }
      onModeChange?.(next);
    },
    [mode, onModeChange],
  );

  const current = isControlled ? (value ?? '') : localValue;
  const commit = useCallback(
    (next: string) => {
      if (isControlled) {
        setLocalValue(next);
      } else {
        setLocalValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const insertAroundSelection = useCallback(
    (action: ToolbarAction) => {
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? start;
      const selected = valueRef.current.slice(start, end);
      const after = action.after ?? action.before;
      const next =
        valueRef.current.slice(0, start) +
        action.before +
        selected +
        after +
        valueRef.current.slice(end);
      commit(next);
      // Inserted toolbar markers lose the caret to the click; restore focus
      // with the caret parked after the inserted span.
      requestAnimationFrame(() => {
        const caret =
          start + action.before.length + selected.length + after.length;
        el.focus();
        el.setSelectionRange(caret, caret);
      });
    },
    [textareaRef, commit],
  );

  const isSplit = currentMode === 'split';
  const showEditor = currentMode !== 'preview';
  const showPreview = currentMode !== 'write';
  const showToolbar = toolbar && !disabled && showEditor;
  // Split needs readable columns; below the md viewport it is not offered.
  const availableModes: MarkdownFieldMode[] = useMemo(
    () =>
      typeof window !== 'undefined' && window.innerWidth < 768
        ? MODE_ORDER.filter((m) => m !== 'split')
        : MODE_ORDER,
    [],
  );

  const description = error
    ? `${fieldId}-error`
    : (ariaDescribedby ?? (subtitle ? `${fieldId}-subtitle` : undefined));

  return (
    <div
      className={cn(
        styles.root,
        resolvedSize !== 'md' && styles[resolvedSize],
        wrapperClassName,
      )}
    >
      {label && (
        <div className={styles.labelRow}>
          <label
            htmlFor={fieldId}
            className={cn(styles.label, required && styles.required)}
          >
            {label}
          </label>
          {showCharCount && maxLength !== undefined && (
            <span className={styles.charCount}>
              {current.length}/{maxLength}
            </span>
          )}
        </div>
      )}
      {subtitle && (
        <span id={`${fieldId}-subtitle`} className={styles.subtitle}>
          {subtitle}
        </span>
      )}
      {modeSwitch && !disabled && availableModes.length > 1 && (
        <div
          role="group"
          aria-label="Editor mode"
          className={styles.modeSwitch}
        >
          {availableModes.map((m) => (
            <button
              key={m}
              type="button"
              className={cn(
                styles.modeButton,
                currentMode === m && styles.modeActive,
              )}
              aria-pressed={currentMode === m}
              onClick={() => handleModeChange(m)}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
      )}
      {showToolbar && (
        <div
          role="toolbar"
          aria-label="Formatting"
          aria-orientation="horizontal"
          className={styles.toolbar}
          data-testid="markdown-toolbar"
        >
          {(toolbarActions ?? DEFAULT_TOOLBAR_ACTIONS).map((action) => (
            <button
              key={action.label}
              type="button"
              className={styles.toolButton}
              aria-label={action.label}
              title={action.label}
              disabled={disabled}
              // Keep the click from moving focus off the textarea.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertAroundSelection(action)}
            >
              {action.glyph}
            </button>
          ))}
        </div>
      )}
      <div className={cn(styles.body, isSplit && styles.bodySplit)}>
        {showEditor && (
          <textarea
            ref={textareaRef}
            id={fieldId}
            rows={rows}
            value={current}
            onChange={(e) => commit(e.target.value)}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            required={required}
            aria-invalid={ariaInvalid ?? (error ? 'true' : undefined)}
            aria-describedby={description}
            className={cn(
              styles.editor,
              flushed && styles.flushed,
              isSplit && styles.editorSplit,
              error && styles.hasError,
              className,
            )}
            {...props}
            {...(textareaProps as Record<string, unknown>)}
          />
        )}
        {showPreview && (
          <div
            aria-live="polite"
            role="region"
            aria-label="Markdown preview"
            className={cn(
              styles.preview,
              isSplit && styles.previewSplit,
              current.length === 0 && styles.previewEmpty,
              previewClassName,
            )}
            data-testid="markdown-preview"
          >
            {current.length === 0
              ? 'Nothing to preview yet.'
              : parseMarkdown(current)}
          </div>
        )}
      </div>
      {error && (
        <span
          id={`${fieldId}-error`}
          className={styles.errorMessage}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
});

MarkdownField.displayName = 'MarkdownField';
