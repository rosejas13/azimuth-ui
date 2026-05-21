'use client';

import { type ComponentPropsWithoutRef, forwardRef, useState, useId } from 'react';
import { cn } from '@/utils/cn';
import styles from './Card.module.css';

/** Props for the Card component. */
export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Header content rendered above the body. */
  header?: React.ReactNode;
  /** Footer content rendered below the body. */
  footer?: React.ReactNode;
  /** Whether the card body is collapsible. @default false */
  expandable?: boolean;
  /** Whether the card is expanded by default. @default true */
  defaultExpanded?: boolean;
  /** The content of the component. */
  children?: React.ReactNode;
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      header,
      footer,
      expandable = false,
      defaultExpanded = true,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const bodyId = useId();

    return (
      <div ref={ref} className={cn(styles.card, className)} {...props}>
        {(header || expandable) && (
          <div className={styles.header}>
            {header && <span className={styles.headerContent}>{header}</span>}
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

/** Props for the Card.Header subcomponent. */
export interface CardHeaderProps extends ComponentPropsWithoutRef<'div'> {
  /** The content of the component. */
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

/** Props for the Card.Footer subcomponent. */
export interface CardFooterProps extends ComponentPropsWithoutRef<'div'> {
  /** The content of the component. */
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

/** Props for the Card.Title subcomponent. */
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

/** Props for the Card.Description subcomponent. */
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

/** Props for the Card.Content subcomponent. */
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
