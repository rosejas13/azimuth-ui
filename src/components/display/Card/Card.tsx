'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useId,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Card.module.css';

/** A flexible card container with header, collapsible body, footer, title, description, and content sub-components. */
export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Custom header node. Takes precedence over {@link CardProps.title} when both are set. */
  header?: React.ReactNode;
  /**
   * Title rendered as a styled heading in the card header row.
   * Ignored when `header` is provided.
   */
  title?: string;
  footer?: React.ReactNode;
  /** @default false */
  expandable?: boolean;
  /** @default true */
  defaultExpanded?: boolean;
  /** @default 'outline' */
  variant?: 'outline' | 'elevated' | 'dashed';
  /** @default false */
  fill?: boolean;
  /** Body content of the card. */
  children?: React.ReactNode;
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      header,
      title,
      footer,
      expandable = false,
      defaultExpanded = true,
      variant,
      fill,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const bodyId = useId();

    return (
      <div
        ref={ref}
        className={cn(
          styles.card,
          variant && variant !== 'outline' && styles[variant],
          fill && styles.fill,
          className,
        )}
        {...props}
      >
        {(header || title || expandable) && (
          <div className={styles.header}>
            {!header && title ? (
              <h3 className={cn(styles.title, styles.headerContent)}>
                {title}
              </h3>
            ) : (
              header && <span className={styles.headerContent}>{header}</span>
            )}
            {expandable && (
              <button
                type="button"
                className={styles.toggle}
                onClick={() => setExpanded((prev) => !prev)}
                aria-expanded={expanded}
                aria-controls={bodyId}
              >
                {expanded ? '−' : '+'}
              </button>
            )}
          </div>
        )}
        <div
          id={bodyId}
          aria-hidden={!expanded || undefined}
          className={cn(styles.body, !expanded && styles.collapsed)}
        >
          {children}
        </div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    );
  },
);

CardRoot.displayName = 'Card';

/** Header area of a card. */
export interface CardHeaderProps extends ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.header, className)} {...props}>
        {children}
      </div>
    );
  },
);

CardHeader.displayName = 'Card.Header';

/** Footer area of a card. */
export interface CardFooterProps extends ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.footer, className)} {...props}>
        {children}
      </div>
    );
  },
);

CardFooter.displayName = 'Card.Footer';

/** Title heading within a card. */
export interface CardTitleProps extends ComponentPropsWithoutRef<'h3'> {
  children?: React.ReactNode;
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3 ref={ref} className={cn(styles.title, className)} {...props}>
        {children}
      </h3>
    );
  },
);

CardTitle.displayName = 'Card.Title';

/** Description text within a card. */
export interface CardDescriptionProps extends ComponentPropsWithoutRef<'p'> {
  children?: React.ReactNode;
}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p ref={ref} className={cn(styles.description, className)} {...props}>
        {children}
      </p>
    );
  },
);

CardDescription.displayName = 'Card.Description';

/** Body content area of a card. */
export interface CardContentProps extends ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.content, className)} {...props}>
        {children}
      </div>
    );
  },
);

CardContent.displayName = 'Card.Content';

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Footer: CardFooter,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
});
