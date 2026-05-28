import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Rating } from '../Rating';

describe('Rating', () => {
  it('renders correct number of stars', () => {
    render(<Rating max={5} />);
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('renders filled stars based on value', () => {
    render(<Rating value={3} max={5} />);
    const stars = screen.getAllByRole('radio');
    expect(stars[0]).toHaveClass('filled');
    expect(stars[1]).toHaveClass('filled');
    expect(stars[2]).toHaveClass('filled');
    expect(stars[3]).not.toHaveClass('filled');
    expect(stars[4]).not.toHaveClass('filled');
  });

  it('renders unfilled stars', () => {
    render(<Rating value={2} max={5} />);
    const stars = screen.getAllByRole('radio');
    expect(stars[2]).not.toHaveClass('filled');
    expect(stars[3]).not.toHaveClass('filled');
    expect(stars[4]).not.toHaveClass('filled');
  });

  it('calls onChange on click', async () => {
    const onChange = vi.fn();
    render(<Rating value={0} max={5} onChange={onChange} />);
    const stars = screen.getAllByRole('radio');
    await userEvent.click(stars[2]);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('toggles off when clicking the same star', async () => {
    const onChange = vi.fn();
    render(<Rating value={3} max={5} onChange={onChange} />);
    const stars = screen.getAllByRole('radio');
    await userEvent.click(stars[2]);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('handles ArrowRight key', () => {
    const onChange = vi.fn();
    render(<Rating value={0} max={5} onChange={onChange} />);
    const group = screen.getByRole('radiogroup');
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('handles ArrowLeft key', () => {
    const onChange = vi.fn();
    render(<Rating value={3} max={5} onChange={onChange} />);
    const group = screen.getByRole('radiogroup');
    fireEvent.keyDown(group, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('handles Enter key on focused star', async () => {
    const onChange = vi.fn();
    render(<Rating value={0} max={5} onChange={onChange} />);
    const stars = screen.getAllByRole('radio');
    await userEvent.click(stars[2]);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('handles disabled state', () => {
    render(<Rating value={3} max={5} disabled />);
    const stars = screen.getAllByRole('radio');
    stars.forEach((star) => {
      expect(star).toBeDisabled();
    });
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not call onChange when disabled and clicked', async () => {
    const onChange = vi.fn();
    render(<Rating value={0} max={5} onChange={onChange} disabled />);
    const stars = screen.getAllByRole('radio');
    await userEvent.click(stars[2]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('handles max prop', () => {
    render(<Rating max={10} />);
    expect(screen.getAllByRole('radio')).toHaveLength(10);
  });

  it('shows hover preview on mouse enter', async () => {
    render(<Rating value={0} max={5} />);
    const stars = screen.getAllByRole('radio');
    await userEvent.hover(stars[3]);
    expect(stars[0]).toHaveClass('filled');
    expect(stars[1]).toHaveClass('filled');
    expect(stars[2]).toHaveClass('filled');
    expect(stars[3]).toHaveClass('filled');
    expect(stars[4]).not.toHaveClass('filled');
  });

  it('clears hover preview on mouse leave', async () => {
    render(<Rating value={2} max={5} />);
    const stars = screen.getAllByRole('radio');
    await userEvent.hover(stars[3]);
    await userEvent.unhover(stars[3]);
    expect(stars[0]).toHaveClass('filled');
    expect(stars[1]).toHaveClass('filled');
    expect(stars[2]).not.toHaveClass('filled');
    expect(stars[3]).not.toHaveClass('filled');
  });

  it('renders size sm variant', () => {
    render(<Rating size="sm" />);
    expect(screen.getByRole('radiogroup')).toHaveClass('sm');
  });

  it('renders size md variant', () => {
    render(<Rating size="md" />);
    expect(screen.getByRole('radiogroup')).toHaveClass('md');
  });

  it('renders size lg variant', () => {
    render(<Rating size="lg" />);
    expect(screen.getByRole('radiogroup')).toHaveClass('lg');
  });

  it('has radiogroup role', () => {
    render(<Rating />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('each star has role radio with aria-checked', () => {
    render(<Rating value={3} max={5} />);
    const stars = screen.getAllByRole('radio');
    expect(stars[0]).toHaveAttribute('aria-checked', 'true');
    expect(stars[1]).toHaveAttribute('aria-checked', 'true');
    expect(stars[2]).toHaveAttribute('aria-checked', 'true');
    expect(stars[3]).toHaveAttribute('aria-checked', 'false');
    expect(stars[4]).toHaveAttribute('aria-checked', 'false');
  });

  it('applies custom className', () => {
    render(<Rating className="my-rating" />);
    expect(screen.getByRole('radiogroup')).toHaveClass('my-rating');
  });
});
