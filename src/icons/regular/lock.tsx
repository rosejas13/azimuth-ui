import { type SVGAttributes, forwardRef } from 'react';

export const LockIcon = forwardRef<
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
    <title>Lock</title>
    <path
      fill="currentColor"
      d="M180 180v60H380V180c0-55.2-44.8-100-100-100s-100 44.8-100 100zM100 240V180C100 80.6 180.6 0 280 0s180 80.6 180 180v60h20c44.2 0 80 35.8 80 80V560c0 44.2-35.8 80-80 80H80c-44.2 0-80-35.8-80-80V320c0-44.2 35.8-80 80-80H100z"
    />
  </svg>
));
LockIcon.displayName = 'LockIcon';
