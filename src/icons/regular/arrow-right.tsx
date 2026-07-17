import { type SVGAttributes, forwardRef } from 'react';

export const ArrowRightIcon = forwardRef<
  SVGSVGElement,
  SVGAttributes<SVGSVGElement>
>(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width="1em"
    height="1em"
    className={className}
    role="img"
    {...props}
  >
    <title>Arrow Right</title>
    <path
      fill="currentColor"
      d="M628.3 348.3c15.6-15.6 15.6-41 0-56.6L468.3 131.7c-15.6-15.6-41-15.6-56.6 0s-15.6 41 0 56.6L503.4 280 40 280c-22.1 0-40 17.9-40 40s17.9 40 40 40l463.4 0L411.7 435.7c-15.6 15.6-15.6 41 0 56.6s41 15.6 56.6 0l160-160z"
    />
  </svg>
));
ArrowRightIcon.displayName = 'ArrowRightIcon';
