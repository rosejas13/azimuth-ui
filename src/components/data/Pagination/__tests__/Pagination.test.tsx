import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('renders a nav with pagination label', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
      />,
    );

    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(nav).toBeInTheDocument();
  });

  it('renders page buttons', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
      />,
    );

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('button', { name: `Page ${i}` })).toBeInTheDocument();
    }
  });

  it('marks the current page with aria-current', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={() => {}}
      />,
    );

    const activeButton = screen.getByRole('button', { name: 'Page 3' });
    expect(activeButton).toHaveAttribute('aria-current', 'page');
  });

  it('renders previous and next buttons', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled();
  });

  it('shows first and last buttons when enabled', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={() => {}}
        showFirstLast
      />,
    );

    expect(screen.getByRole('button', { name: 'First page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeInTheDocument();
  });

  it('hides first and last buttons by default', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={() => {}}
      />,
    );

    expect(screen.queryByRole('button', { name: 'First page' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Last page' })).toBeNull();
  });

  it('triggers onPageChange on page click', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={handleChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Page 5' }));
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it('triggers onPageChange on previous click', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={handleChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it('triggers onPageChange on next click', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={handleChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('triggers onPageChange with Enter key', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={handleChange}
      />,
    );

    const button = screen.getByRole('button', { name: 'Page 5' });
    button.focus();
    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it('does not trigger onPageChange for current page', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={handleChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('shows ellipsis for gap pages', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={() => {}}
        siblingCount={1}
      />,
    );

    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  it('applies custom className', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
        className="custom-pagination"
      />,
    );

    expect(screen.getByRole('navigation')).toHaveClass('custom-pagination');
  });

  it('renders sm size variant', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
        size="sm"
      />,
    );

    expect(screen.getByRole('navigation')).toHaveClass('sm');
  });

  it('handles single page edge case', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });
});
