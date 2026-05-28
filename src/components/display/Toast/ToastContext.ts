'use client';

import { createContext } from 'react';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastOptions {
  title: string;
  message?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  dismissible?: boolean;
  position?: ToastPosition;
  timeout?: number;
}

export const ToastContext = createContext<{
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
} | null>(null);
