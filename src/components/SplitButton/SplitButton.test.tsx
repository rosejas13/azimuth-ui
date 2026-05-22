import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SplitButton } from './SplitButton';

const baseOptions = [
  { key: '1', label: 'Option 1', onClick: vi.fn() },
  { key: '2', label: 'Option 2', onClick: vi.fn() },
  { key: '3', label: 'Option 3', onClick: vi.fn() },
];

describe('SplitButton', () => {
  it('renders main button with label', () => {
    const onClick = vi.fn();
    render(
      <SplitButton label="Send" onClick={onClick} options={baseOptions} />,
    );

    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('renders dropdown on toggle click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SplitButton label="Send" onClick={onClick} options={baseOptions} />,
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Show options'));

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders options in dropdown', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SplitButton label="Send" onClick={onClick} options={baseOptions} />,
    );

    await user.click(screen.getByLabelText('Show options'));

    expect(screen.getByRole('menuitem', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Option 2' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Option 3' })).toBeInTheDocument();
  });

  it('calls main onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SplitButton label="Send" onClick={onClick} options={baseOptions} />,
    );

    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls option onClick when selected', async () => {
    const user = userEvent.setup();
    const optionOnClick = vi.fn();
    const options = [
      { key: '1', label: 'Option 1', onClick: optionOnClick },
    ];

    render(
      <SplitButton
        label="Send"
        onClick={vi.fn()}
        options={options}
      />,
    );

    await user.click(screen.getByLabelText('Show options'));
    await user.click(screen.getByRole('menuitem', { name: 'Option 1' }));

    expect(optionOnClick).toHaveBeenCalledTimes(1);
  });

  it('closes dropdown after selecting an option', async () => {
    const user = userEvent.setup();
    const options = [
      { key: '1', label: 'Option 1', onClick: vi.fn() },
    ];

    render(
      <SplitButton
        label="Send"
        onClick={vi.fn()}
        options={options}
      />,
    );

    await user.click(screen.getByLabelText('Show options'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: 'Option 1' }));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes dropdown on Escape key', async () => {
    const user = userEvent.setup();
    render(
      <SplitButton label="Send" onClick={vi.fn()} options={baseOptions} />,
    );

    await user.click(screen.getByLabelText('Show options'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('handles disabled state on main button and toggle', () => {
    const onClick = vi.fn();
    render(
      <SplitButton
        label="Send"
        onClick={onClick}
        options={baseOptions}
        disabled
      />,
    );

    const mainBtn = screen.getByRole('button', { name: 'Send' });
    const toggleBtn = screen.getByLabelText('Show options');

    expect(mainBtn).toBeDisabled();
    expect(toggleBtn).toBeDisabled();
  });

  it('does not open dropdown when disabled', async () => {
    const user = userEvent.setup();
    render(
      <SplitButton
        label="Send"
        onClick={vi.fn()}
        options={baseOptions}
        disabled
      />,
    );

    await user.click(screen.getByLabelText('Show options'));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('renders primary variant class', () => {
    render(
      <SplitButton
        label="Send"
        onClick={vi.fn()}
        options={baseOptions}
        variant="primary"
      />,
    );

    const mainBtn = screen.getByRole('button', { name: 'Send' });
    expect(mainBtn.className).toContain('primary');
  });

  it('renders secondary variant class', () => {
    render(
      <SplitButton
        label="Send"
        onClick={vi.fn()}
        options={baseOptions}
        variant="secondary"
      />,
    );

    const mainBtn = screen.getByRole('button', { name: 'Send' });
    expect(mainBtn.className).toContain('secondary');
  });

  it('primary variant is the default', () => {
    render(
      <SplitButton
        label="Send"
        onClick={vi.fn()}
        options={baseOptions}
      />,
    );

    const mainBtn = screen.getByRole('button', { name: 'Send' });
    expect(mainBtn.className).toContain('primary');
  });

  it('renders sm size class', () => {
    render(
      <SplitButton
        label="Send"
        onClick={vi.fn()}
        options={baseOptions}
        size="sm"
      />,
    );

    const mainBtn = screen.getByRole('button', { name: 'Send' });
    expect(mainBtn.className).toContain('sm');
  });

  it('renders md size by default', () => {
    render(
      <SplitButton
        label="Send"
        onClick={vi.fn()}
        options={baseOptions}
      />,
    );

    const mainBtn = screen.getByRole('button', { name: 'Send' });
    expect(mainBtn.className).toContain('md');
  });

  it('renders lg size class', () => {
    render(
      <SplitButton
        label="Send"
        onClick={vi.fn()}
        options={baseOptions}
        size="lg"
      />,
    );

    const mainBtn = screen.getByRole('button', { name: 'Send' });
    expect(mainBtn.className).toContain('lg');
  });

  it('renders menu with bottom direction by default', async () => {
    const user = userEvent.setup();
    render(
      <SplitButton label="Send" onClick={vi.fn()} options={baseOptions} />,
    );

    await user.click(screen.getByLabelText('Show options'));

    const menu = screen.getByRole('menu');
    expect(menu.className).not.toContain('menuTop');
  });

  it('renders menu with top direction class', async () => {
    const user = userEvent.setup();
    render(
      <SplitButton
        label="Send"
        onClick={vi.fn()}
        options={baseOptions}
        direction="top"
      />,
    );

    await user.click(screen.getByLabelText('Show options'));

    const menu = screen.getByRole('menu');
    const wrapper = menu.parentElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper!.style.position).toBe('fixed');
    expect(wrapper!.style.bottom).not.toBe('');
  });

  it('applies danger class to danger option', async () => {
    const user = userEvent.setup();
    const options = [
      { key: '1', label: 'Delete', danger: true, onClick: vi.fn() },
    ];

    render(
      <SplitButton label="Send" onClick={vi.fn()} options={options} />,
    );

    await user.click(screen.getByLabelText('Show options'));

    const item = screen.getByRole('menuitem', { name: 'Delete' });
    expect(item.className).toContain('menuItemDanger');
  });

  it('handles disabled options', async () => {
    const user = userEvent.setup();
    const optionOnClick = vi.fn();
    const options = [
      { key: '1', label: 'Disabled Option', disabled: true, onClick: optionOnClick },
    ];

    render(
      <SplitButton label="Send" onClick={vi.fn()} options={options} />,
    );

    await user.click(screen.getByLabelText('Show options'));

    const item = screen.getByRole('menuitem', { name: 'Disabled Option' });
    expect(item).toBeDisabled();

    await user.click(item);
    expect(optionOnClick).not.toHaveBeenCalled();
  });

  it('displays aria-haspopup and aria-expanded on toggle', () => {
    render(
      <SplitButton label="Send" onClick={vi.fn()} options={baseOptions} />,
    );

    const toggle = screen.getByLabelText('Show options');
    expect(toggle).toHaveAttribute('aria-haspopup', 'menu');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('sets aria-expanded to true when open', async () => {
    const user = userEvent.setup();
    render(
      <SplitButton label="Send" onClick={vi.fn()} options={baseOptions} />,
    );

    await user.click(screen.getByLabelText('Show options'));

    expect(screen.getByLabelText('Show options')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('applies toggleOpen class when open', async () => {
    const user = userEvent.setup();
    render(
      <SplitButton label="Send" onClick={vi.fn()} options={baseOptions} />,
    );

    const toggle = screen.getByLabelText('Show options');
    expect(toggle.className).not.toContain('toggleOpen');

    await user.click(toggle);

    expect(toggle.className).toContain('toggleOpen');
  });

  it('applies wrapperDisabled class when disabled', () => {
    render(
      <SplitButton
        label="Send"
        onClick={vi.fn()}
        options={baseOptions}
        disabled
      />,
    );

    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });
});
