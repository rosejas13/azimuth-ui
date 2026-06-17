import { type SVGAttributes, forwardRef } from 'react';

export const MixIcon = forwardRef<SVGSVGElement, SVGAttributes<SVGSVGElement>>(
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
        d="M96 128L96 476.9C96 533.1 184 535 184 476.9L184 238.3C191.9 185.4 272 187.9 272 244.8L272 420.1C272 478 368 478.1 368 420.1L368 304C373.3 249.3 456 251.5 456 308.3L456 332.1C456 392 544 388.7 544 332.1L544 128L96 128z"
      />
    </svg>
  ),
);
MixIcon.displayName = 'MixIcon';
