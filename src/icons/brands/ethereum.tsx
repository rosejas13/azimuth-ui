import { type SVGAttributes, forwardRef } from 'react';

export const EthereumIcon = forwardRef<SVGSVGElement, SVGAttributes<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={className} {...props}>
      <path fill="currentColor" d="M471.9 324.8L320 417.6L168 324.8L320 64L471.9 324.8zM320 447.4L168 354.6L320 576L472 354.6L320 447.4z"/>
    </svg>
  ),
);
EthereumIcon.displayName = 'EthereumIcon';
