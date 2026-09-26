import { forwardRef } from 'react';
import { Button, type ButtonProps } from '@/components/input/Button';
import styles from './IconButton.module.css';

/** An icon-only button. Wraps the Button component; circular by default, with an optional square shape. */
export interface IconButtonProps extends Omit<
  ButtonProps,
  'iconPosition' | 'shape'
> {
  /** Icon element to render inside the button. */
  icon: React.ReactNode;
  /** Accessible label for the icon-only button. */
  'aria-label': string;
  /** @default 'circle' */
  shape?: 'circle' | 'square';
}

/** A button that displays only an icon, circular by default. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon, variant = 'tertiary', size = 'md', shape = 'circle', ...props },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        shape={shape === 'square' ? 'default' : 'circle'}
        className={shape === 'square' ? styles.square : undefined}
        icon={icon}
        {...props}
      />
    );
  },
);

IconButton.displayName = 'IconButton';
