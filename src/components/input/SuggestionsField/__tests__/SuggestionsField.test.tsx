import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { SuggestionsField } from '../SuggestionsField';
import { InputConfigProvider } from '../../input-config';

function Harness({
  initialValues = [],
  onChange: externalOnChange,
  ...props
}: Omit<
  React.ComponentProps<typeof SuggestionsField>,
  'values' | 'onChange'
> & {
  initialValues?: string[];
  onChange?: React.ComponentProps<typeof SuggestionsField>['onChange'];
}) {
  const [values, setValues] = useState<string[]>(initialValues);
  const handleChange = (next: string[]) => {
    setValues(next);
    externalOnChange?.(next);
  };
  return (
    <SuggestionsField values={values} onChange={handleChange} {...props} />
  );
}

describe('SuggestionsField (free mode)', () => {
  it('renders chips for values and a text input', () => {
    render(
      <SuggestionsField
        mode="free"
        values={['React', 'Vitest']}
        onChange={vi.fn()}
        label="Skills"
      />,
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vitest')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  it('Enter commits the typed value and calls onSelect', async () => {
    const onChange = vi.fn();
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <SuggestionsField
        mode="free"
        values={[]}
        onChange={onChange}
        onSelect={onSelect}
      />,
    );
    const input = screen.getByRole('textbox');
    await user.type(input, 'React');
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(['React']);
    expect(onSelect).toHaveBeenCalledWith('React');
    expect(input).toHaveValue('');
  });

  it('comma commits the typed value', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SuggestionsField mode="free" values={[]} onChange={onChange} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'React,');
    expect(onChange).toHaveBeenCalledWith(['React']);
  });

  it('Enter with blank text does not commit', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SuggestionsField mode="free" values={[]} onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), '   ');
    await user.keyboard('{Enter}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('duplicate values are ignored', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SuggestionsField mode="free" values={['React']} onChange={onChange} />,
    );
    await user.type(screen.getByRole('textbox'), 'React');
    await user.keyboard('{Enter}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('commits free text exactly as typed (no case forcing)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SuggestionsField mode="free" values={[]} onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'REACT');
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(['REACT']);
  });

  it('Backspace on an empty input pops the last chip', async () => {
    const onChange = vi.fn();
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <Harness
        initialValues={['React', 'Vitest']}
        mode="free"
        onChange={onChange}
        onRemove={onRemove}
      />,
    );
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.keyboard('{Backspace}');
    expect(onChange).toHaveBeenCalledWith(['React']);
    expect(onRemove).toHaveBeenCalledWith('Vitest');
    expect(screen.queryByText('Vitest')).not.toBeInTheDocument();
  });

  it('removing a chip keeps the remaining values (via Harness state)', async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <Harness
        initialValues={['React', 'Vitest']}
        mode="free"
        onRemove={onRemove}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Remove Vitest' }));
    expect(onRemove).toHaveBeenCalledWith('Vitest');
    expect(screen.queryByText('Vitest')).not.toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});

describe('SuggestionsField (suggestions mode)', () => {
  const options = ['Apple', 'Banana', 'Cherry'];

  it('opening the field shows the available options (combobox aria)', async () => {
    const user = userEvent.setup();
    render(<Harness suggestions={{ options }} aria-label="Fruit" />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getAllByRole('option')[0]).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('typing filters the option list', async () => {
    const user = userEvent.setup();
    render(<Harness suggestions={{ options }} />);
    const input = screen.getByRole('combobox');
    await user.type(input, 'ba');
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Apple' }),
    ).not.toBeInTheDocument();
  });

  it('Enter commits the highlighted option and clears the input', async () => {
    const onChange = vi.fn();
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <Harness
        suggestions={{ options }}
        onChange={onChange}
        onSelect={onSelect}
      />,
    );
    const input = screen.getByRole('combobox');
    await user.type(input, 'ban');
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(['Banana']);
    expect(onSelect).toHaveBeenCalledWith('Banana');
    expect(input).toHaveValue('');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('navigating with ArrowDown moves the highlight before Enter', async () => {
    const user = userEvent.setup();
    render(<Harness suggestions={{ options }} />);
    await user.click(screen.getByRole('combobox'));
    const opts = screen.getAllByRole('option');
    expect(opts[0]).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowDown}');
    expect(opts[0]).toHaveAttribute('aria-selected', 'false');
    expect(opts[1]).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clicking an option commits it', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Harness suggestions={{ options }} onSelect={onSelect} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Cherry' }));
    expect(onSelect).toHaveBeenCalledWith('Cherry');
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });

  it('custom typed values are rejected with a visible hint', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness suggestions={{ options }} onChange={onChange} />);
    const input = screen.getByRole('combobox');
    await user.type(input, 'zzz');
    await user.keyboard('{Enter}');
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Must be selected from the list.',
    );
  });

  it('filter: false shows every option regardless of the typed text', async () => {
    const user = userEvent.setup();
    render(<Harness suggestions={{ options, filter: false }} />);
    await user.type(screen.getByRole('combobox'), 'zzz');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Cherry' })).toBeInTheDocument();
  });

  it('already-committed options are no longer listed', async () => {
    const user = userEvent.setup();
    render(<Harness initialValues={['Apple']} suggestions={{ options }} />);
    await user.click(screen.getByRole('combobox'));
    expect(
      screen.queryByRole('option', { name: 'Apple' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
  });

  it('max caps further selections with a hint', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Harness
        initialValues={['Apple']}
        suggestions={{ options, max: 1 }}
        onChange={onChange}
      />,
    );
    await user.type(screen.getByRole('combobox'), 'ban');
    await user.keyboard('{Enter}');
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Maximum 1 selected.');
  });

  it('Escape closes the list', async () => {
    const user = userEvent.setup();
    render(<Harness suggestions={{ options }} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

describe('SuggestionsField (fixed mode)', () => {
  const options = ['Electricity', 'Gas', 'Water'];

  it('renders every option as a toggle chip and reflects membership', () => {
    render(
      <Harness
        mode="fixed"
        initialValues={['Gas']}
        suggestions={{ options }}
      />,
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Gas' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Electricity' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('clicking an unselected chip selects it', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <Harness mode="fixed" suggestions={{ options }} onSelect={onSelect} />,
    );
    await user.click(screen.getByRole('button', { name: 'Gas' }));
    expect(onSelect).toHaveBeenCalledWith('Gas');
    expect(screen.getByRole('button', { name: 'Gas' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('clicking a selected chip deselects it (removal allowed)', async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <Harness
        mode="fixed"
        initialValues={['Gas', 'Water']}
        suggestions={{ options }}
        onRemove={onRemove}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Gas' }));
    expect(onRemove).toHaveBeenCalledWith('Gas');
    expect(screen.getByRole('button', { name: 'Gas' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Water' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('max caps the selected count in fixed mode', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Harness
        mode="fixed"
        initialValues={['Gas']}
        suggestions={{ options, max: 1 }}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Water' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Maximum 1 selected.');
  });
});

describe('SuggestionsField status + a11y wiring', () => {
  it('error sets role=alert, aria-invalid and aria-describedby on the input', () => {
    render(
      <SuggestionsField
        values={[]}
        onChange={vi.fn()}
        label="Skills"
        error="Required"
      />,
    );
    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Required');
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', error.id);
  });

  it('subtitle is wired through aria-describedby', () => {
    render(
      <SuggestionsField
        values={[]}
        onChange={vi.fn()}
        label="Skills"
        subtitle="Comma-separated values"
      />,
    );
    const subtitle = screen.getByText('Comma-separated values');
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-describedby',
      subtitle.id,
    );
  });

  it('disabled disables the input and the chip remove buttons', () => {
    render(<Harness initialValues={['React']} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeDisabled();
  });
});

describe('SuggestionsField size inheritance (InputConfigContext)', () => {
  it('inherits size from InputConfigContext', () => {
    const { container } = render(
      <InputConfigProvider value={{ size: 'sm' }}>
        <SuggestionsField values={[]} onChange={vi.fn()} />
      </InputConfigProvider>,
    );
    expect(container.firstChild).toHaveClass('sm');
  });

  it('instance size wins over context', () => {
    const { container } = render(
      <InputConfigProvider value={{ size: 'sm' }}>
        <SuggestionsField values={[]} onChange={vi.fn()} size="lg" />
      </InputConfigProvider>,
    );
    expect(container.firstChild).toHaveClass('lg');
    expect(container.firstChild).not.toHaveClass('sm');
  });

  it('defaults to md without context', () => {
    const { container } = render(
      <SuggestionsField values={[]} onChange={vi.fn()} />,
    );
    expect(container.firstChild).toHaveClass('md');
  });
});

describe('SuggestionsField curated escape hatch', () => {
  it('containerProps attributes land on the wrapper (spread last, wins)', () => {
    const { container } = render(
      <SuggestionsField
        values={[]}
        onChange={vi.fn()}
        containerProps={{ 'data-testid': 'field-wrap' }}
      />,
    );
    expect(container.querySelector('[data-testid="field-wrap"]')).toHaveClass(
      'wrapper',
    );
  });

  it('label htmlFor targets the input (click focuses it)', async () => {
    const user = userEvent.setup();
    render(<Harness label="Skills" />);
    await user.click(screen.getByText('Skills'));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('aria-label from the curated surface names the input', () => {
    render(<Harness aria-label="Custom name" />);
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-label',
      'Custom name',
    );
  });
});
