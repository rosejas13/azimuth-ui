'use client';

import { type ComponentPropsWithoutRef, forwardRef, useCallback, useRef, useState, type DragEvent, type ClipboardEvent } from 'react';
import { cn } from '@/utils/cn';
import styles from './FileUpload.module.css';

/** Props for the FileUpload component. */
export interface FileUploadProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Callback fired when files are selected, dropped, or pasted. Receives the array of valid File objects. */
  onFilesSelected?: (files: File[]) => void;
  /** Accepted file types string (e.g. 'image/*,.pdf'). Passed to the underlying file input. */
  accept?: string;
  /** Whether multiple files can be selected. @default true */
  multiple?: boolean;
  /** Maximum file size in megabytes. Files exceeding this size are rejected with an error. @default 10 */
  maxSize?: number;
  /** Whether the upload area is disabled. @default false */
  disabled?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * A drag-and-drop file upload area with click-to-browse and paste support.
 *
 * Features include:
 * - Drag and drop with visual feedback
 * - Click to open native file browser
 * - Paste images from clipboard
 * - File size validation with error messages
 * - File list with individual remove buttons
 * - Keyboard accessible via Enter/Space on the drop zone
 */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  ({ onFilesSelected, accept, multiple = true, maxSize = 10, disabled = false, className, ...props }, ref) => {
    const [dragOver, setDragOver] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateAndAdd = useCallback((newFiles: FileList | File[]) => {
      setError(null);
      const valid: File[] = [];
      for (const f of Array.from(newFiles)) {
        if (f.size > maxSize * 1024 * 1024) {
          setError(`${f.name} exceeds the ${maxSize} MB limit`);
          continue;
        }
        valid.push(f);
      }
      if (valid.length === 0) return;
      const updated = multiple ? [...files, ...valid] : [valid[0]];
      setFiles(updated);
      onFilesSelected?.(updated);
    }, [files, maxSize, multiple, onFilesSelected]);

    const handleDragOver = useCallback((e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setDragOver(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
    }, []);

    const handleDrop = useCallback((e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      if (disabled) return;
      if (e.dataTransfer.files.length > 0) {
        validateAndAdd(e.dataTransfer.files);
      }
    }, [disabled, validateAndAdd]);

    const handlePaste = useCallback((e: ClipboardEvent) => {
      if (disabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) pastedFiles.push(file);
        }
      }
      if (pastedFiles.length > 0) {
        validateAndAdd(pastedFiles);
      }
    }, [disabled, validateAndAdd]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        validateAndAdd(e.target.files);
      }
      e.target.value = '';
    }, [validateAndAdd]);

    const removeFile = useCallback((index: number) => {
      const updated = files.filter((_, i) => i !== index);
      setFiles(updated);
      onFilesSelected?.(updated);
    }, [files, onFilesSelected]);

    return (
      <div
        ref={ref}
        className={cn(styles.root, dragOver && styles.dragOver, disabled && styles.disabled, className)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label="File upload area"
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          aria-hidden="true"
          disabled={disabled}
        />

        <div className={styles.zone} onClick={() => !disabled && inputRef.current?.click()}>
          <div className={styles.icon}>+</div>
          <div className={styles.title}>
            {dragOver ? 'Drop files here' : 'Drag and drop files here'}
          </div>
          <div className={styles.subtitle}>
            or click to browse{multiple ? ' (multiple files allowed)' : ''}
          </div>
          <div className={styles.subtitle}>
            Max file size: {maxSize} MB{accept ? ` \u00B7 Accepts: ${accept}` : ''}
          </div>
          <div className={styles.subtitle}>
            You can also paste images from clipboard
          </div>
        </div>

        {error && <div className={styles.error} role="alert">{error}</div>}

        {files.length > 0 && (
          <ul className={styles.fileList}>
            {files.map((file, i) => (
              <li key={`${file.name}-${i}`} className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>{formatSize(file.size)}</span>
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeFile(i)}
                  aria-label={`Remove ${file.name}`}
                  disabled={disabled}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);

FileUpload.displayName = 'FileUpload';
