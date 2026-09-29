import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InputGroup } from '../InputGroup';
import { Input } from '../../Input/Input';
import { Select } from '../../Select/Select';

describe('InputGroup', () => {
  it('renders children', () => {
    render(
      <InputGroup>
        <input type="text" placeholder="First" />
        <input type="text" placeholder="Second" />
      </InputGroup>,
    );
    expect(screen.getByPlaceholderText('First')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Second')).toBeInTheDocument();
  });

  it('applies role group', () => {
    render(
      <InputGroup>
        <button type="button">A</button>
        <button type="button">B</button>
      </InputGroup>,
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <InputGroup className="my-group">
        <input type="text" placeholder="Input" />
      </InputGroup>,
    );
    const group = screen.getByRole('group');
    expect(group.className).toContain('my-group');
  });

  it('passes additional props', () => {
    render(
      <InputGroup data-testid="my-group">
        <input type="text" placeholder="Input" />
      </InputGroup>,
    );
    expect(screen.getByTestId('my-group')).toBeInTheDocument();
  });

  it('handles empty children', () => {
    const { container } = render(<InputGroup />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with buttons', () => {
    render(
      <InputGroup>
        <button type="button">Left</button>
        <input type="text" placeholder="Middle" />
        <button type="button">Right</button>
      </InputGroup>,
    );
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Middle')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('inherits labelPosition to child inputs', () => {
    render(
      <InputGroup labelPosition="left">
        <Input label="First" />
        <Input label="Second" />
      </InputGroup>,
    );
    const first = screen.getByLabelText('First').closest('[class*="wrapper"]');
    const second = screen
      .getByLabelText('Second')
      .closest('[class*="wrapper"]');
    expect(first?.className).toContain('wrapperHorizontal');
    expect(second?.className).toContain('wrapperHorizontal');
  });

  it('inherits size to a child select', () => {
    render(
      <InputGroup size="lg">
        <Select label="Second" options={[{ value: 'a', label: 'A' }]} />
      </InputGroup>,
    );
    const wrapper = screen
      .getByLabelText('Second')
      .closest('[class*="wrapper"]');
    expect(wrapper?.className).toContain('lg');
  });

  it('lets a child input override the group size', () => {
    render(
      <InputGroup labelPosition="left">
        <Input label="Default" />
        <Input label="Override" labelPosition="top" />
      </InputGroup>,
    );
    const wrapper = screen
      .getByLabelText('Default')
      .closest('[class*="wrapper"]');
    const override = screen
      .getByLabelText('Override')
      .closest('[class*="wrapper"]');
    expect(wrapper?.className).toContain('wrapperHorizontal');
    expect(override?.className).not.toContain('wrapperHorizontal');
  });

  describe('align', () => {
    it('defaults to fill class (current behavior preserved)', () => {
      render(
        <InputGroup>
          <input type="text" placeholder="First" />
        </InputGroup>,
      );
      expect(screen.getByRole('group').className).toContain('alignFill');
    });

    it('applies alignStart class', () => {
      render(
        <InputGroup align="start">
          <input type="text" placeholder="First" />
        </InputGroup>,
      );
      expect(screen.getByRole('group').className).toContain('alignStart');
    });

    it('applies alignEnd class', () => {
      render(
        <InputGroup align="end">
          <Input placeholder="Search" />
          <button type="button">Go</button>
        </InputGroup>,
      );
      const group = screen.getByRole('group');
      expect(group.className).toContain('alignEnd');
    });

    it('alignEnd still renders all children', () => {
      render(
        <InputGroup align="end">
          <Input placeholder="Search" />
          <button type="button">Go</button>
        </InputGroup>,
      );
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(screen.getByText('Go')).toBeInTheDocument();
    });
  });

  describe('responsive', () => {
    it('does not apply responsive class by default', () => {
      render(
        <InputGroup>
          <input type="text" placeholder="First" />
        </InputGroup>,
      );
      expect(screen.getByRole('group').className).not.toContain('responsive');
    });

    it('applies responsive class when set', () => {
      render(
        <InputGroup responsive>
          <input type="text" placeholder="First" />
          <input type="text" placeholder="Second" />
        </InputGroup>,
      );
      expect(screen.getByRole('group').className).toContain('responsive');
    });

    it('combines with align prop', () => {
      render(
        <InputGroup align="end" responsive>
          <Input placeholder="Search" />
          <button type="button">Go</button>
        </InputGroup>,
      );
      const group = screen.getByRole('group');
      expect(group.className).toContain('alignEnd');
      expect(group.className).toContain('responsive');
    });
  });
});

describe('InputGroup flush', () => {
  it('child Inputs drop their corner radius class inside the group', () => {
    const { container } = render(
      <InputGroup>
        <Input defaultValue="a" />
        <Input defaultValue="b" />
      </InputGroup>,
    );
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBe(2);
    inputs.forEach((i) => expect(i.className).toContain('flushed'));
  });

  it('responsive (stacked) groups do not flush children', () => {
    const { container } = render(
      <InputGroup responsive>
        <Input defaultValue="a" />
      </InputGroup>,
    );
    expect(container.querySelector('input')!.className).not.toContain(
      'flushed',
    );
  });

  it('Inputs outside a group stay unflushed', () => {
    const { container } = render(<Input defaultValue="solo" />);
    expect(
      (container.querySelector('input') as HTMLInputElement).className,
    ).not.toContain('flushed');
  });

  it('a nested group inherits the master group flush', () => {
    const { container } = render(
      <InputGroup>
        <InputGroup>
          <Input defaultValue="a" />
        </InputGroup>
      </InputGroup>,
    );
    expect(container.querySelector('input')!.className).toContain('flushed');
  });

  it('a nested group keeps an unflushed (responsive) master state', () => {
    const { container } = render(
      <InputGroup responsive>
        <InputGroup>
          <Input defaultValue="a" />
        </InputGroup>
      </InputGroup>,
    );
    expect(container.querySelector('input')!.className).not.toContain(
      'flushed',
    );
  });

  it('a responsive nested group inside a flushed master is unflushed', () => {
    const { container } = render(
      <InputGroup>
        <InputGroup responsive>
          <Input defaultValue="a" />
        </InputGroup>
      </InputGroup>,
    );
    expect(container.querySelector('input')!.className).not.toContain(
      'flushed',
    );
  });
});
