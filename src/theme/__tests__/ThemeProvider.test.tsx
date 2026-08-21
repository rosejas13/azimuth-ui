import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '../ThemeProvider';
import { useTheme } from '../useTheme';

function TestConsumer() {
  useTheme();
  return <div data-testid="consumer">ok</div>;
}

/**
 * Reads a --azimuth-* token value out of ThemeProvider's injected
 * `data-azimuth-tokens` style block. Tokens are emitted into an injected
 * :root rule (inside the azimuth.runtime cascade layer) rather than inline
 * styles, and jsdom does not resolve cascade layers via getComputedStyle,
 * so we assert against the emitted CSS text directly.
 */
function injectedToken(name: string): string | undefined {
  const block = document.head.querySelector('style[data-azimuth-tokens]');
  const match = block?.textContent?.match(new RegExp(`${name}:\\s*([^;]+);`));
  return match?.[1].trim();
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

  it('emits non-color tokens into the injected runtime layer, not inline', () => {
    render(
      <ThemeProvider>
        <div />
      </ThemeProvider>,
    );
    // No longer set as inline documentElement styles (that would be
    // un-overridable by consumer CSS).
    expect(
      document.documentElement.style.getPropertyValue('--azimuth-radius-md'),
    ).toBe('');
    // Present in the injected tokens block instead.
    expect(injectedToken('--azimuth-radius-md')).toBe('8px');
    const block = document.head.querySelector('style[data-azimuth-tokens]');
    expect(block?.textContent).toContain('@layer azimuth.runtime');
  });

  it('emits the shadow-xl token (raised elevation by default)', () => {
    render(
      <ThemeProvider>
        <div />
      </ThemeProvider>,
    );
    expect(injectedToken('--azimuth-shadow-xl')).toBe(
      '0 8px 32px 0 rgb(0 0 0 / 0.10)',
    );
  });

  it('scales shadow-xl above shadow-lg for the floating elevation', () => {
    render(
      <ThemeProvider config={{ elevation: 'floating' }}>
        <div />
      </ThemeProvider>,
    );
    expect(injectedToken('--azimuth-shadow-xl')).toBe(
      '0 20px 64px 0 rgb(0 0 0 / 0.18)',
    );
    expect(injectedToken('--azimuth-shadow-lg')).toBe(
      '0 12px 48px 0 rgb(0 0 0 / 0.15)',
    );
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

  it('wraps every injected block in the azimuth.runtime layer', () => {
    render(
      <ThemeProvider config={{ mode: 'light' }}>
        <div />
      </ThemeProvider>,
    );
    for (const id of ['tokens', 'light', 'dark']) {
      const block = document.head.querySelector(`style[data-azimuth-${id}]`);
      expect(block, `expected data-azimuth-${id} block`).toBeTruthy();
      expect(block?.textContent).toContain('@layer azimuth.runtime');
    }
  });

  it('reflects config changes in the injected token block', () => {
    const { rerender } = render(
      <ThemeProvider config={{ borderRadius: 'none' }}>
        <div />
      </ThemeProvider>,
    );
    expect(injectedToken('--azimuth-radius')).toBe('0px');

    rerender(
      <ThemeProvider config={{ borderRadius: 'lg' }}>
        <div />
      </ThemeProvider>,
    );
    expect(injectedToken('--azimuth-radius')).toBe('12px');
  });

  it('does not leak non-color tokens onto inline documentElement styles', () => {
    render(
      <ThemeProvider config={{ spacing: 'spacious' }}>
        <div />
      </ThemeProvider>,
    );
    const inline = document.documentElement.style;
    for (const name of [
      '--azimuth-space-md',
      '--azimuth-radius-md',
      '--azimuth-shadow-lg',
      '--azimuth-font-body',
      '--azimuth-ease',
    ]) {
      expect(inline.getPropertyValue(name)).toBe('');
    }
  });
});

describe('ThemeProvider base-styles warning', () => {
  async function freshProvider() {
    vi.resetModules();
    const mod = await import('../ThemeProvider');
    return mod.ThemeProvider;
  }

  it('warns once when the base stylesheet is missing', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal('getComputedStyle', () => ({
      getPropertyValue: () => '',
    }));

    const Provider = await freshProvider();
    render(
      <Provider>
        <div />
      </Provider>,
    );

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('azimuth-ui/styles.css'),
    );
    vi.unstubAllGlobals();
  });

  it('stays silent when the base stylesheet is present', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal('getComputedStyle', () => ({
      getPropertyValue: () => '8px',
    }));

    const Provider = await freshProvider();
    render(
      <Provider>
        <div />
      </Provider>,
    );

    expect(console.warn).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
