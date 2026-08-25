import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spacer } from '../Spacer';

describe('Spacer', () => {
  it('renders a div that is hidden from assistive technology', () => {
    const { container } = render(<Spacer />);
    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('defaults to flex-grow 1', () => {
    const { container } = render(<Spacer />);
    expect(container.firstChild).toHaveStyle({ flexGrow: '1' });
  });

  it('reflects the flex prop in flexGrow', () => {
    const { container } = render(<Spacer flex={2} />);
    expect(container.firstChild).toHaveStyle({ flexGrow: '2' });
  });

  it('sets flex-basis to zero', () => {
    const { container } = render(<Spacer flex={3} />);
    expect(container.firstChild).toHaveStyle({ flexBasis: '0' });
  });

  it('passes through native props like data-testid', () => {
    render(<Spacer data-testid="gap" />);
    expect(screen.getByTestId('gap')).toBeInTheDocument();
  });
});
