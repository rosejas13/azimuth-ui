import { type SVGAttributes, forwardRef } from 'react';

export const SearchIcon = forwardRef<
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
    <title>Search</title>
    <path
      fill="currentColor"
      d="M520 260c0 57.4-18.6 110.4-50 153.4L628 571.8c15.6 15.6 15.6 41 0 56.6s-41 15.6-56.6 0L413.4 470c-43 31.4-96 50-153.4 50C116.4 520 0 403.6 0 260S116.4 0 260 0s260 116.4 260 260zM260 440c99.4 0 180-80.6 180-180s-80.6-180-180-180S80 160.6 80 260s80.6 180 180 180z"
    />
  </svg>
));
SearchIcon.displayName = 'SearchIcon';
