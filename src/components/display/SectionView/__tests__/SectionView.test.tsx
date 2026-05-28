import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SectionView } from '../SectionView';

describe('SectionView', () => {
  it('renders title and children', () => {
    render(
      <SectionView title="My Section">
        <p>Section content</p>
      </SectionView>,
    );
    expect(screen.getByText('My Section')).toBeInTheDocument();
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('starts collapsed by default', () => {
    render(
      <SectionView title="Collapsed">
        <p>Hidden content</p>
      </SectionView>,
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('starts expanded when defaultExpanded is true', () => {
    render(
      <SectionView title="Expanded" defaultExpanded>
        <p>Visible content</p>
      </SectionView>,
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles on click', async () => {
    const user = userEvent.setup();
    render(
      <SectionView title="Toggle Me">
        <p>Toggle content</p>
      </SectionView>,
    );
    const trigger = screen.getByRole('button');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls onToggle callback', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(
      <SectionView title="Callback" onToggle={onToggle}>
        <p>Content</p>
      </SectionView>,
    );
    await user.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith(true);
    await user.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('respects controlled expanded prop', () => {
    const { rerender } = render(
      <SectionView title="Controlled" expanded={false}>
        <p>Content</p>
      </SectionView>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');

    rerender(
      <SectionView title="Controlled" expanded>
        <p>Content</p>
      </SectionView>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('controlled mode does not toggle internally but fires onToggle', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(
      <SectionView title="Controlled" expanded={false} onToggle={onToggle}>
        <p>Content</p>
      </SectionView>,
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(onToggle).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('applies custom className', () => {
    render(
      <SectionView title="Classy" className="my-section">
        <p>Content</p>
      </SectionView>,
    );
    const container = screen.getByText('Classy').closest('[class*="my-section"]');
    expect(container).toBeTruthy();
  });

  it('has correct accessibility attributes', () => {
    render(
      <SectionView title="Accessible">
        <p>Accessible content</p>
      </SectionView>,
    );
    const trigger = screen.getByRole('button', { name: 'Accessible' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls');

    const region = screen.getByRole('region');
    expect(trigger.getAttribute('aria-controls')).toBe(region.id);
  });

  it('chevron has aria-hidden', () => {
    render(
      <SectionView title="Chevron test">
        <p>Content</p>
      </SectionView>,
    );
    const chevron = screen.getByRole('button').querySelector('[aria-hidden="true"]');
    expect(chevron).toBeTruthy();
  });
});
