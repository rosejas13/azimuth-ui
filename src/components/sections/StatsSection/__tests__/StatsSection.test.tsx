import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatsSection } from '../StatsSection';

const defaultStats = [
  { value: '10K', label: 'Users' },
  { value: '99.9', label: 'Uptime', suffix: '%' },
  { value: '0', label: 'Setup Cost', prefix: '$' },
];

describe('StatsSection', () => {
  it('renders stats with value and label', () => {
    render(<StatsSection stats={defaultStats} />);
    expect(screen.getByText('10K')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<StatsSection stats={defaultStats} title="Our Stats" />);
    expect(screen.getByText('Our Stats')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<StatsSection stats={defaultStats} subtitle="Key metrics" />);
    expect(screen.getByText('Key metrics')).toBeInTheDocument();
  });

  it('renders stat with prefix and suffix', () => {
    render(<StatsSection stats={defaultStats} />);
    expect(screen.getByText('99.9%')).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('renders stat with icon', () => {
    render(
      <StatsSection
        stats={[
          {
            value: '100',
            label: 'Items',
            icon: <span data-testid="icon">★</span>,
          },
        ]}
      />,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatsSection stats={defaultStats} className="custom-stats" />,
    );
    expect(container.firstChild).toHaveClass('custom-stats');
  });

  it('applies section id', () => {
    const { container } = render(
      <StatsSection stats={defaultStats} id="stats-section" />,
    );
    expect(container.firstChild).toHaveAttribute('id', 'stats-section');
  });

  it('applies variant class', () => {
    const { container } = render(
      <StatsSection stats={defaultStats} variant="dark" />,
    );
    expect(container.firstChild).toHaveClass('dark');
  });

  it('renders as section element', () => {
    const { container } = render(<StatsSection stats={defaultStats} />);
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });

  it('renders correct number of stat items', () => {
    render(<StatsSection stats={defaultStats} />);
    expect(screen.getByText('10K')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('applies columns class', () => {
    const { container } = render(
      <StatsSection stats={defaultStats} columns={2} />,
    );
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('cols2');
  });
});
