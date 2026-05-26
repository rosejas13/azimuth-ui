import { forwardRef } from 'react';
import { Button, type ButtonProps } from '@/primitives/Button/Button';

export interface IconButtonProps extends Omit<ButtonProps, 'iconPosition' | 'shape'> {
  icon: React.ReactNode;
  'aria-label': string;
}

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
