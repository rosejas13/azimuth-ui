import { type SVGAttributes, forwardRef } from 'react';

export const LockOpenIcon = forwardRef<
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
    <title>Lock Open</title>
    <path
      fill="currentColor"
      d="M420 0c-100.3 0-180 80.7-180 180v60H80c-44.2 0-80 35.8-80 80V560c0 44.2 35.8 80 80 80H480c44.2 0 80-35.8 80-80V320c0-44.2-35.8-80-80-80H340V180c0-55.2 44.8-100 100-100s100 44.8 100 100v20c0 22.1 17.9 40 40 40s40-17.9 40-40V180C620 80.7 540.3 0 440 0H420z"
    />
  </svg>
));
LockOpenIcon.displayName = 'LockOpenIcon';
