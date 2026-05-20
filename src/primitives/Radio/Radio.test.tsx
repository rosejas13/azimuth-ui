import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Radio } from './Radio';

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
});
