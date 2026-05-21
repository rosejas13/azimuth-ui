'use client';

import { type ComponentPropsWithoutRef, type KeyboardEvent, forwardRef, useRef, useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import styles from './Chat.module.css';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp?: Date;
}

export interface ChatProps extends ComponentPropsWithoutRef<'div'> {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  /** @default 'Type a message...' */
  placeholder?: string;
}

/**
 * A chat conversation widget with message bubbles, auto-scroll, and a send interface.
 *
 * Renders messages in a scrollable list with user messages aligned right and
 * other messages aligned left. Supports keyboard submission via Enter key.
 * Automatically scrolls to the latest message when new messages arrive.
 */
export const Chat = forwardRef<HTMLDivElement, ChatProps>(
  ({ messages, onSend, placeholder = 'Type a message...', className, ...props }, ref) => {
    const [input, setInput] = useState('');
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, [messages]);

    function handleSend() {
      const text = input.trim();
      if (!text) return;
      onSend(text);
      setInput('');
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }

    function formatTime(date: Date): string {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
      <div ref={ref} className={cn(styles.chat, className)} {...props}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Chat</span>
        </div>
        <div ref={listRef} className={styles.list} aria-live="polite">
          {messages.length === 0 && (
            <div className={styles.empty}>No messages yet. Start the conversation!</div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(styles.bubble, msg.sender === 'user' ? styles.user : styles.other)}
            >
              <div className={styles.text}>{msg.text}</div>
              {msg.timestamp && (
                <div className={styles.time}>{formatTime(msg.timestamp)}</div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.inputRow}>
          <input
            className={styles.input}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Message input"
          />
          <button
            type="button"
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </div>
    );
  },
);

Chat.displayName = 'Chat';
