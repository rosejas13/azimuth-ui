import { type SVGAttributes, forwardRef } from 'react';

export const XTwitterIcon = forwardRef<SVGSVGElement, SVGAttributes<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={className} {...props}>
      <path fill="currentColor" d="M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z"/>
    </svg>
  ),
);
XTwitterIcon.displayName = 'XTwitterIcon';
