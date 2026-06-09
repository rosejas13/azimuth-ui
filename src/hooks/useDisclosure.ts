'use client';
import { useState, useCallback } from 'react';

/** Provides open, close, and toggle callbacks for boolean visibility state. @returns `isOpen` state and `onOpen`, `onClose`, `onToggle`, `setIsOpen` callbacks. */
export function useDisclosure(
  /** @default false */
  initialOpen = false,
) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);
  return { isOpen, onOpen, onClose, onToggle, setIsOpen };
}
