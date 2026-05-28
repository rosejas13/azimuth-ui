import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Radio } from '../Radio';

describe('Radio', () => {
  it('renders radio', () => {
    render(<Radio />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Radio label="Option A" />);
    expect(screen.getByLabelText('Option A')).toBeInTheDocument();
  });

  it('renders with children as label', () => {
    render(<Radio>Option B</Radio>);
    expect(screen.getByLabelText('Option B')).toBeInTheDocument();
  });

  it('fires onChange', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Radio onChange={handleChange} />);
    await user.click(screen.getByRole('radio'));
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('can be disabled', () => {
    render(<Radio disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('can be checked by default', () => {
    render(<Radio defaultChecked />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('groups correctly by name', () => {
    render(
      <>
        <Radio name="group" value="a" label="A" />
        <Radio name="group" value="b" label="B" />
      </>,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveAttribute('name', 'group');
    expect(radios[1]).toHaveAttribute('name', 'group');
  });

  it('keyboard navigation: clicking each radio checks it and fires onChange', async () => {
    const handleChangeA = vi.fn();
    const handleChangeB = vi.fn();
    const handleChangeC = vi.fn();
    const user = userEvent.setup();
    render(
      <>
        <Radio name="group" value="a" label="A" onChange={handleChangeA} />
        <Radio name="group" value="b" label="B" onChange={handleChangeB} />
        <Radio name="group" value="c" label="C" onChange={handleChangeC} />
      </>,
    );
    const radios = screen.getAllByRole('radio');

    await user.click(radios[0]);
    expect(radios[0]).toBeChecked();
    expect(radios[0]).toHaveFocus();
    expect(handleChangeA).toHaveBeenCalledOnce();

    await user.click(radios[1]);
    expect(radios[1]).toBeChecked();
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toHaveFocus();
    expect(handleChangeB).toHaveBeenCalledOnce();

    await user.click(radios[2]);
    expect(radios[2]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
    expect(radios[2]).toHaveFocus();
    expect(handleChangeC).toHaveBeenCalledOnce();
  });

  it('respects controlled checked prop', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<Radio checked={false} onChange={handleChange} />);
    const radio = screen.getByRole('radio');
    await user.click(radio);
    expect(radio).not.toBeChecked();
    rerender(<Radio checked onChange={handleChange} />);
    expect(radio).toBeChecked();
  });

  it('renders with wrapper CSS class', () => {
    const { container } = render(<Radio label="test" />);
    expect(container.firstChild).toHaveClass('wrapper');
  });

  it('renders with disabled wrapper CSS class when disabled', () => {
    const { container } = render(<Radio disabled label="test" />);
    expect(container.firstChild).toHaveClass('wrapperDisabled');
  });
});
