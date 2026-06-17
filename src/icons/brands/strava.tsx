import { type SVGAttributes, forwardRef } from 'react';

export const StravaIcon = forwardRef<
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
    {...props}
  >
    <path
      fill="currentColor"
      d="M286.4 64L135 356L224.2 356L286.4 239.9L348.1 356L436.6 356L286.4 64zM436.6 356L392.7 444.2L348.1 356L280.5 356L392.7 576L504.2 356L436.6 356z"
    />
  </svg>
));
StravaIcon.displayName = 'StravaIcon';
