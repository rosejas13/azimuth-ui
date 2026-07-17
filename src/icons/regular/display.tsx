import { type SVGAttributes, forwardRef } from 'react';

export const MonitorIcon = forwardRef<SVGSVGElement, SVGAttributes<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      width="1em"
      height="1em"
      className={className}
      {...props}
    >
      <path
        fill="currentColor"
        d="M80 32C35.8 32 0 67.8 0 112V400c0 44.2 35.8 80 80 80H272l-10.7 32H176c-22.1 0-40 17.9-40 40s17.9 40 40 40H464c22.1 0 40-17.9 40-40s-17.9-40-40-40H378.7L368 480H560c44.2 0 80-35.8 80-80V112c0-44.2-35.8-80-80-80H80zM80 96H560c8.8 0 16 7.2 16 16V384c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16z"
      />
    </svg>
  ),
);
MonitorIcon.displayName = 'MonitorIcon';
