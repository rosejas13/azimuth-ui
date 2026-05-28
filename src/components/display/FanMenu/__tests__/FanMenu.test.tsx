import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FanMenu } from '../FanMenu';

const defaultOptions = [
  { key: 'edit', label: 'Edit', onClick: vi.fn() },
  { key: 'delete', label: 'Delete', onClick: vi.fn() },
  { key: 'share', label: 'Share', onClick: vi.fn(), disabled: true },
];

describe('FanMenu', () => {
  it('renders trigger', () => {
    render(<FanMenu options={defaultOptions} />);
    expect(screen.getByRole('button', { name: 'Open fan menu' })).toBeInTheDocument();
  });

  it('renders custom trigger', () => {
    render(
      <FanMenu
        options={defaultOptions}
        trigger={<span>Custom</span>}
      />,
    );
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('opens menu on trigger click', async () => {
    const user = userEvent.setup();
    render(<FanMenu options={defaultOptions} />);
    await user.click(screen.getByRole('button', { name: 'Open fan menu' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('shows options when open', async () => {
    const user = userEvent.setup();
    render(<FanMenu options={defaultOptions} />);
    await user.click(screen.getByRole('button', { name: 'Open fan menu' }));
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Share' })).toBeInTheDocument();
  });

  it('has aria-expanded on trigger', async () => {
    const user = userEvent.setup();
    render(<FanMenu options={defaultOptions} />);
    const trigger = screen.getByRole('button', { name: 'Open fan menu' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('fires option onClick and closes', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <FanMenu
        options={[{ key: 'test', label: 'Test', onClick }]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Open fan menu' }));
    await user.click(screen.getByRole('menuitem', { name: 'Test' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('does not fire onClick for disabled options', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <FanMenu
        options={[{ key: 'test', label: 'Test', onClick, disabled: true }]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Open fan menu' }));
    await user.click(screen.getByRole('menuitem', { name: 'Test' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<FanMenu options={defaultOptions} />);
    await user.click(screen.getByRole('button', { name: 'Open fan menu' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('applies className', () => {
    render(
      <FanMenu options={defaultOptions} className="test-class" />,
    );
    expect(screen.getByRole('button', { name: 'Open fan menu' }).parentElement?.parentElement).toHaveClass('test-class');
  });

  it('opens on Enter key from trigger', async () => {
    const user = userEvent.setup();
    render(<FanMenu options={defaultOptions} />);
    const trigger = screen.getByRole('button', { name: 'Open fan menu' });
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('respects controlled open state', () => {
    render(<FanMenu options={defaultOptions} open={true} onOpenChange={() => {}} />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('respects controlled closed state', () => {
    render(<FanMenu options={defaultOptions} open={false} onOpenChange={() => {}} />);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
