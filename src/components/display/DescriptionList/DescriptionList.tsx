import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './DescriptionList.module.css';

export interface DescriptionListItemProps extends Omit<
  ComponentPropsWithoutRef<'dd'>,
  'children'
> {
  /** The term label rendered as a <dt> element. */
  term: string;
  children: ReactNode;
}

/** A term/description pair within a {@link DescriptionList}. */
export const DescriptionListItem = forwardRef<
  HTMLElement,
  DescriptionListItemProps
>(({ term, children, ...props }, ref) => {
  return (
    <div className={styles.item}>
      <dt className={styles.term}>{term}</dt>
      <dd ref={ref} className={styles.description} {...props}>
        {children}
      </dd>
    </div>
  );
});

DescriptionListItem.displayName = 'DescriptionList.Item';

export interface DescriptionListProps extends ComponentPropsWithoutRef<'dl'> {
  /** @default false */
  bordered?: boolean;
}

/** A semantic list of term/description pairs for settings pages and spec sheets. */
const DescriptionListRoot = forwardRef<HTMLDListElement, DescriptionListProps>(
  ({ bordered = false, className, ...props }, ref) => {
    return (
      <dl
        ref={ref}
        className={cn(styles.list, bordered && styles.bordered, className)}
        {...props}
      />
    );
  },
);

DescriptionListRoot.displayName = 'DescriptionList';

export const DescriptionList = Object.assign(DescriptionListRoot, {
  Item: DescriptionListItem,
});
