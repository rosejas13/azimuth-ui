import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '../ThemeProvider';
import { useTheme } from '../useTheme';

function TestConsumer() {
  useTheme();
  return <div data-testid="consumer">ok</div>;
}

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider>
        <div>hello</div>
      </ThemeProvider>,
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('provides theme context', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('consumer')).toBeInTheDocument();
  });

  it('applies CSS custom properties to document', () => {
    render(
      <ThemeProvider>
        <div />
      </ThemeProvider>,
    );
    const root = document.documentElement;
    const radius = root.style.getPropertyValue('--azimuth-radius-md');
    expect(radius).toBe('8px');
  });

  it('injects light/dark style tags', () => {
    render(
      <ThemeProvider config={{ mode: 'light' }}>
        <div />
      </ThemeProvider>,
    );
    const style = document.head.querySelector('style[data-azimuth-light]');
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('--azimuth-color-accent');
  });
});
