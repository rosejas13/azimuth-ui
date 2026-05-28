import { forwardRef } from 'react';
import { Button, type ButtonProps } from '@/components/input/Button';

/** A round icon-only button. Wraps the Button component with a circle shape. */
export interface IconButtonProps extends Omit<ButtonProps, 'iconPosition' | 'shape'> {
  /** Icon element to render inside the button. */
  icon: React.ReactNode;
  /** Accessible label for the icon-only button. */
  'aria-label': string;
}

/** A circular button that displays only an icon. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'tertiary', size = 'md', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        shape="circle"
        icon={icon}
        {...props}
      />
    );
  },
);

IconButton.displayName = 'IconButton';
