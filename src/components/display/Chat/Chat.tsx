'use client';

import {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
  forwardRef,
  useRef,
  useEffect,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import { Loader } from '../Loader';
import { renderMarkdown } from './markdown';
import styles from './Chat.module.css';

/** A single message within a chat conversation. */
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp?: Date;
  /**
   * How to render `text`. `'markdown'` renders a safe Markdown subset (bold,
   * italic, lists, code, links) via a dependency-free renderer; raw HTML in
   * the text is escaped, never executed. Per-message so a single conversation
   * can mix plain and rich content.
   * @default 'text'
   */
  format?: 'text' | 'markdown';
}

/** A chat conversation widget with message bubbles, auto-scroll, and a send interface. */
export interface ChatProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'title'
> {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  /** @default 'Type a message...' */
  placeholder?: string;
  /**
   * Header title. Pass a string or any node (e.g. a language/model selector).
   * @default 'Chat'
   */
  title?: ReactNode;
  /** Right-aligned actions rendered in the header (buttons, menus, etc.). */
  headerActions?: ReactNode;
  /** Hide the header entirely when the consumer supplies its own chrome. */
  hideHeader?: boolean;
  /**
   * Content shown when there are no messages.
   * @default 'No messages yet. Start the conversation!'
   */
  emptyState?: ReactNode;
  /**
   * Render the body of a message bubble yourself (correction cards, citations,
   * tool-call chips, TTS buttons, etc.). When provided, Chat calls this instead
   * of rendering `msg.text`, but still owns bubble layout, alignment,
   * timestamp, auto-scroll, and aria-live. `msg.text` remains required as an
   * accessibility/copy fallback.
   */
  renderMessage?: (msg: ChatMessage) => ReactNode;
  /**
   * Marks the conversation as awaiting/receiving an assistant reply. Shows a
   * typing indicator at the end of the list and sets `aria-busy` on the
   * surface and composer.
   *
   * Streaming contract: to stream a reply, mutate the last message's `text`
   * and pass a **new `messages` array reference** on each chunk so Chat
   * re-renders and keeps the view pinned to the bottom (only when the user is
   * already near the bottom). Set `busy` to true while streaming and back to
   * false when the turn completes; the completed assistant message is
   * announced once via a polite live region rather than on every token.
   */
  busy?: boolean;
  /** Accessible label for the typing indicator. @default 'Assistant is typing' */
  busyLabel?: string;
}

/**
 * A chat conversation widget with message bubbles, auto-scroll, and a send interface.
 *
 * Renders messages in a scrollable list with user messages aligned right and
 * other messages aligned left. Supports keyboard submission via Enter key.
 * Automatically scrolls to the latest message when new messages arrive.
 */
export const Chat = forwardRef<HTMLDivElement, ChatProps>(
  (
    {
      messages,
      onSend,
      placeholder = 'Type a message...',
      title = 'Chat',
      headerActions,
      hideHeader = false,
      emptyState = 'No messages yet. Start the conversation!',
      renderMessage,
      busy = false,
      busyLabel = 'Assistant is typing',
      className,
      ...props
    },
    ref,
  ) => {
    const [input, setInput] = useState('');
    const [announcement, setAnnouncement] = useState('');
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    // Whether the user is scrolled to (or near) the bottom of the list. Used to
    // decide whether incoming messages should force-scroll the viewport.
    const nearBottomRef = useRef(true);

    function handleListScroll() {
      const el = listRef.current;
      if (!el) return;
      nearBottomRef.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    }

    // Keep pinned to the bottom on new/updated content, but only if the user
    // hasn't scrolled up to read history.
    useEffect(() => {
      const el = listRef.current;
      if (el && nearBottomRef.current) {
        el.scrollTop = el.scrollHeight;
      }
    }, [messages, busy]);

    // Announce the latest assistant message politely, but not on every
    // streamed token: only update the live region when not actively streaming.
    useEffect(() => {
      const list = messages ?? [];
      const last = list[list.length - 1];
      if (!busy && last && last.sender === 'other') {
        setAnnouncement(last.text);
      }
    }, [messages, busy]);

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    // Auto-grow the textarea to fit its content, up to a max height (set via
    // CSS max-height) after which it scrolls internally.
    function autosize(el: HTMLTextAreaElement) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }

    useEffect(() => {
      if (inputRef.current) autosize(inputRef.current);
    }, [input]);

    function handleSend() {
      const text = input.trim();
      if (!text) return;
      onSend(text);
      setInput('');
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }

    function formatTime(date: Date): string {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return (
      <div
        ref={ref}
        className={cn(styles.chat, className)}
        aria-busy={busy || undefined}
        {...props}
      >
        {!hideHeader && (
          <div className={styles.header}>
            <span className={styles.headerTitle}>{title}</span>
            {headerActions && (
              <div className={styles.headerActions}>{headerActions}</div>
            )}
          </div>
        )}
        <div ref={listRef} className={styles.list} onScroll={handleListScroll}>
          {(messages ?? []).length === 0 && (
            <div className={styles.empty}>{emptyState}</div>
          )}
          {(messages ?? []).map((msg) => (
            <div
              key={msg.id}
              className={cn(
                styles.bubble,
                msg.sender === 'user' ? styles.user : styles.other,
              )}
            >
              <div className={styles.text}>
                {renderMessage
                  ? renderMessage(msg)
                  : msg.format === 'markdown'
                    ? renderMarkdown(msg.text)
                    : msg.text}
              </div>
              {msg.timestamp && (
                <div className={styles.time}>{formatTime(msg.timestamp)}</div>
              )}
            </div>
          ))}
          {busy && (
            <div className={cn(styles.bubble, styles.other, styles.typing)}>
              <Loader variant="bar" size="sm" label={busyLabel} />
            </div>
          )}
        </div>
        {/* Polite live region: announces the completed assistant reply once,
            not on every streamed token. */}
        <div className={styles.srOnly} aria-live="polite" role="status">
          {announcement}
        </div>
        <div className={styles.inputRow}>
          <textarea
            ref={inputRef}
            className={styles.input}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Message input"
            aria-busy={busy || undefined}
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
