import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Cursor, useCursor } from './Cursor';
import { renderHook } from '@testing-library/react';

describe('Cursor', () => {
  it('renders children', () => {
    render(<Cursor>Hello</Cursor>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders as a span', () => {
    render(<Cursor data-testid="c">X</Cursor>);
    expect(screen.getByTestId('c').tagName).toBe('SPAN');
  });

  it('applies default cursor style', () => {
    render(<Cursor data-testid="c">X</Cursor>);
    expect(screen.getByTestId('c')).toHaveStyle({ cursor: 'default' });
  });

  it('applies custom cursor style', () => {
    render(<Cursor cursor="pointer" data-testid="c">X</Cursor>);
    expect(screen.getByTestId('c')).toHaveStyle({ cursor: 'pointer' });
  });

  it('passes through extra props', () => {
    render(<Cursor className="my-cursor">X</Cursor>);
    expect(screen.getByText('X')).toHaveClass('my-cursor');
  });

  it('merges style prop', () => {
    render(
      <Cursor cursor="grab" style={{ color: 'red' }} data-testid="c">
        X
      </Cursor>,
    );
    const el = screen.getByTestId('c');
    expect(el).toHaveStyle({ cursor: 'grab', color: 'rgb(255, 0, 0)' });
  });

  it('renders all cursor values without error', () => {
    const cursors = [
      'pointer',
      'default',
      'not-allowed',
      'text',
      'move',
      'wait',
      'grab',
      'grabbing',
      'crosshair',
      'help',
      'none',
      'col-resize',
      'row-resize',
    ] as const;
    for (const c of cursors) {
      const { unmount } = render(
        <Cursor cursor={c} data-testid="c">
          {c}
        </Cursor>,
      );
      expect(screen.getByTestId('c')).toHaveStyle({ cursor: c });
      unmount();
    }
  });
});

describe('useCursor', () => {
  it('sets cursor on body when mounted', () => {
    const prev = document.body.style.cursor;
    const { unmount } = renderHook(() => useCursor('pointer'));
    expect(document.body.style.cursor).toBe('pointer');
    unmount();
    expect(document.body.style.cursor).toBe(prev);
  });

  it('restores previous cursor on unmount', () => {
    document.body.style.cursor = 'crosshair';
    const { unmount } = renderHook(() => useCursor('wait'));
    expect(document.body.style.cursor).toBe('wait');
    unmount();
    expect(document.body.style.cursor).toBe('crosshair');
  });
});
