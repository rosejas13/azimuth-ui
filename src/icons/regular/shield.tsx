import { type SVGAttributes, forwardRef } from 'react';

export const ShieldIcon = forwardRef<
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
    <title>Shield</title>
    <path
      fill="currentColor"
      d="M316.7 3.6C311.5 1.3 305.9 0 300 0s-11.5 1.3-16.7 3.6L47.9 103.5C20.4 115.1 0 142.3 0 173V218.8c0 87.4 30.8 173.3 86.1 241.1c55.5 67.9 132.7 116.5 216.4 138.3c6.9 1.8 14.1 1.8 21 0c83.6-21.8 160.8-70.4 216.4-138.3C609.2 392 640 306.2 640 218.8V173c0-30.7-20.4-57.9-47.9-69.5L316.7 3.6z"
    />
  </svg>
));
ShieldIcon.displayName = 'ShieldIcon';
