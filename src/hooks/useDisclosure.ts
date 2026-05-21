'use client';
import { useState, useCallback } from 'react';

export function useDisclosure(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);
  return { isOpen, onOpen, onClose, onToggle, setIsOpen };
}
