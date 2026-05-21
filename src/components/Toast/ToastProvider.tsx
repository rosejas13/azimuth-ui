'use client';

import { useState, useCallback, useRef } from 'react';
import { Toast } from './Toast';
import { ToastContext, type ToastOptions, type ToastPosition } from './ToastContext';
import { cn } from '@/utils/cn';
import styles from './Toast.module.css';

interface ToastEntry {
  id: string;
  options: ToastOptions;
}

const DEFAULT_POSITION: ToastPosition = 'bottom-right';

const POSITION_TO_CLASS: Record<ToastPosition, string> = {
  'top-left': 'topLeft',
  'top-center': 'topCenter',
  'top-right': 'topRight',
  'bottom-left': 'bottomLeft',
  'bottom-center': 'bottomCenter',
  'bottom-right': 'bottomRight',
};

function getAnimIn(position: ToastPosition): string {
  if (position === 'top-left' || position === 'bottom-left') return 'slideInLeft';
  if (position === 'top-center') return 'slideInTop';
  if (position === 'bottom-center') return 'slideInBottom';
  return 'slideInRight';
}

function getAnimOut(position: ToastPosition): string {
  if (position === 'top-left' || position === 'bottom-left') return 'slideOutLeft';
  if (position === 'top-center') return 'slideOutTop';
  if (position === 'bottom-center') return 'slideOutBottom';
  return 'slideOutRight';
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [exiting, setExiting] = useState<Set<string>>(new Set());
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setExiting((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        setExiting((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 200);
      return next;
    });
  }, []);

  const toast = useCallback(
    (options: ToastOptions): string => {
      const id = `toast-${++counterRef.current}`;
      setToasts((prev) => [...prev, { id, options }]);
      return id;
    },
    [],
  );

  const grouped = toasts.reduce<Record<ToastPosition, ToastEntry[]>>((acc, item) => {
    const pos = item.options.position ?? DEFAULT_POSITION;
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(item);
    return acc;
  }, {} as Record<ToastPosition, ToastEntry[]>);

  const positions = Object.keys(grouped) as ToastPosition[];

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {positions.map((pos) => (
        <div
          key={pos}
          className={cn(styles.toastContainer, styles[POSITION_TO_CLASS[pos]])}
        >
          {grouped[pos].map((item) => {
            const animIn = getAnimIn(pos);
            const animOut = getAnimOut(pos);
            const autoDismissMs = item.options.timeout ?? item.options.duration ?? 5000;
            return (
              <div
                key={item.id}
                className={cn(
                  styles.toastItem,
                  styles[animIn],
                  exiting.has(item.id) && styles.toastItemExiting,
                  exiting.has(item.id) && styles[animOut],
                )}
              >
                <Toast
                  variant={item.options.variant ?? 'info'}
                  title={item.options.title}
                  message={item.options.message}
                  dismissible={item.options.dismissible ?? true}
                  autoDismiss={autoDismissMs}
                  onDismiss={() => dismiss(item.id)}
                />
              </div>
            );
          })}
        </div>
      ))}
    </ToastContext.Provider>
  );
}
