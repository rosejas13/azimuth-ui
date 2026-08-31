import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Row } from '../Row';
import { Form } from '../../../input/Form';
import { Input } from '../../../input/Input';

describe('Row', () => {
  it('renders children in a div', () => {
    const { container } = render(
      <Row>
        <span>First</span>
        <span>Second</span>
      </Row>,
    );
    expect(container.firstChild?.nodeName).toBe('DIV');
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('applies gapMd class by default', () => {
    const { container } = render(
      <Row>
        <span>A</span>
      </Row>,
    );
    expect(container.firstChild).toHaveClass('gapMd');
  });

  it('is wrapped by default', () => {
    const { container } = render(
      <Row>
        <span>A</span>
      </Row>,
    );
    expect(container.firstChild).toHaveClass('wrap');
    expect(container.firstChild).not.toHaveClass('nowrap');
  });

  it('does not wrap when wrap is false', () => {
    const { container } = render(
      <Row wrap={false}>
        <span>A</span>
      </Row>,
    );
    expect(container.firstChild).toHaveClass('nowrap');
    expect(container.firstChild).not.toHaveClass('wrap');
  });

  it('applies formRow class inside a Form so children share width', () => {
    const { container } = render(
      <Form>
        <Row>
          <Input label="First name" name="firstName" />
          <Input label="Last name" name="lastName" />
        </Row>
      </Form>,
    );
    const row = container.querySelector('div.wrap');
    expect(row).not.toBeNull();
    expect(row).toHaveClass('formRow');
  });

  it('does not apply formRow class outside a Form', () => {
    const { container } = render(
      <Row>
        <span>A</span>
      </Row>,
    );
    expect(container.firstChild).not.toHaveClass('formRow');
  });

  it('explicit align overrides the in-form default alignment class', () => {
    const { container } = render(
      <Form>
        <Row align="center">
          <Input label="Email" name="email" />
        </Row>
      </Form>,
    );
    const row = container.querySelector('div.formRow');
    expect(row).not.toBeNull();
    expect(row).toHaveClass('alignCenter');
  });

  it('applies align variant CSS classes', () => {
    const aligns = ['start', 'center', 'end', 'stretch', 'baseline'] as const;
    for (const align of aligns) {
      const { container, unmount } = render(
        <Row align={align}>
          <span>A</span>
        </Row>,
      );
      const expectedClass = `align${align.charAt(0).toUpperCase() + align.slice(1)}`;
      expect(container.firstChild).toHaveClass(expectedClass);
      unmount();
    }
  });

  it('applies justify variant CSS classes', () => {
    const justifies = ['start', 'center', 'end', 'between', 'around'] as const;
    for (const justify of justifies) {
      const { container, unmount } = render(
        <Row justify={justify}>
          <span>A</span>
        </Row>,
      );
      const expectedClass = `justify${justify.charAt(0).toUpperCase() + justify.slice(1)}`;
      expect(container.firstChild).toHaveClass(expectedClass);
      unmount();
    }
  });

  it('applies gap variant CSS classes', () => {
    const gaps = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
    for (const gap of gaps) {
      const { container, unmount } = render(
        <Row gap={gap}>
          <span>A</span>
        </Row>,
      );
      const expectedClass = `gap${gap.charAt(0).toUpperCase() + gap.slice(1)}`;
      expect(container.firstChild).toHaveClass(expectedClass);
      unmount();
    }
  });

  it('applies custom className and forwards native props', () => {
    const { container } = render(
      <Row className="my-row" data-testid="row" aria-label="toolbar">
        <span>A</span>
      </Row>,
    );
    expect(container.firstChild).toHaveClass('my-row');
    expect(screen.getByTestId('row')).toHaveAttribute('aria-label', 'toolbar');
  });

  it('applies childWidths string to all children', () => {
    const { container } = render(
      <Row childWidths="min-content">
        <span>A</span>
        <span>B</span>
      </Row>,
    );
    const children = container.querySelectorAll('.row > *');
    expect(children[0]).toHaveStyle({ width: 'min-content' });
    expect(children[1]).toHaveStyle({ width: 'min-content' });
  });

  it('applies childWidths array left-to-right and cycles last value', () => {
    const { container } = render(
      <Row childWidths={['min-content', 'max-content']}>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </Row>,
    );
    const children = container.querySelectorAll('.row > *');
    expect(children[0]).toHaveStyle({ width: 'min-content' });
    expect(children[1]).toHaveStyle({ width: 'max-content' });
    expect(children[2]).toHaveStyle({ width: 'max-content' });
  });

  it('preserves existing child style when applying childWidths', () => {
    const { container } = render(
      <Row childWidths="min-content">
        <span style={{ color: 'red' }}>A</span>
      </Row>,
    );
    const child = container.querySelector('.row > span');
    expect(child).toHaveStyle({ width: 'min-content' });
    expect(child).toHaveAttribute('style');
    expect(child?.getAttribute('style')).toContain('color');
    expect(child?.getAttribute('style')).toContain('width: min-content');
  });
});
