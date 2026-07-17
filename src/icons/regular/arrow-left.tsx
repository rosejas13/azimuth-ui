import { type SVGAttributes, forwardRef } from 'react';

export const ArrowLeftIcon = forwardRef<
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
    <title>Arrow Left</title>
    <path
      fill="currentColor"
      d="M11.7 348.3c-15.6-15.6-15.6-41 0-56.6l160-160c15.6-15.6 41-15.6 56.6 0s15.6 41 0 56.6L136.6 280 600 280c22.1 0 40 17.9 40 40s-17.9 40-40 40l-463.4 0 91.7 91.7c15.6 15.6 15.6 41 0 56.6s-41 15.6-56.6 0l-160-160z"
    />
  </svg>
));
ArrowLeftIcon.displayName = 'ArrowLeftIcon';
