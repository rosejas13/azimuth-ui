import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Tag } from '../Tag';

describe('Tag', () => {
  it('renders text', () => {
    render(<Tag>React</Tag>);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders with remove button', () => {
    render(<Tag removable>React</Tag>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('fires onRemove', async () => {
    const handleRemove = vi.fn();
    const user = userEvent.setup();
    render(<Tag removable onRemove={handleRemove}>React</Tag>);
    await user.click(screen.getByRole('button'));
    expect(handleRemove).toHaveBeenCalledOnce();
  });

  it('does not show remove button when not removable', () => {
    render(<Tag>React</Tag>);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders all variants', () => {
    const variants = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const;
    for (const variant of variants) {
      const { unmount } = render(<Tag variant={variant}>{variant}</Tag>);
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    }
  });
});
