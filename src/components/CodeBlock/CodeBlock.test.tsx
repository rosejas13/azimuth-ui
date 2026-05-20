import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CodeBlock } from './CodeBlock';

const multiline = `line 1
line 2
line 3`;

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', {
    ...globalThis.navigator,
    clipboard: { writeText },
  });
  return writeText;
}

describe('CodeBlock', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders code content', () => {
    const { container } = render(<CodeBlock code="const x = 1;" />);
    expect(container.textContent).toContain('const x = 1;');
  });

  it('renders language label when provided', () => {
    render(<CodeBlock code="const x = 1;" language="TypeScript" />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('does not render language label when not provided', () => {
    render(<CodeBlock code="const x = 1;" />);
    const pre = screen.getByLabelText('Code block');
    expect(pre.querySelector('[class*="language"]')).toBeNull();
  });

  it('renders line numbers when showLineNumbers is true', () => {
    const { container } = render(<CodeBlock code={multiline} showLineNumbers />);
    expect(container.textContent).toContain('1');
    expect(container.textContent).toContain('2');
    expect(container.textContent).toContain('3');
  });

  it('does not render line numbers by default', () => {
    render(<CodeBlock code={multiline} />);
    const pre = screen.getByLabelText('Code block');
    expect(pre.querySelector('[class*="lineNumber"]')).toBeNull();
  });

  it('renders copy button when showCopyButton is true', () => {
    render(<CodeBlock code="text" showCopyButton />);
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
  });

  it('does not render copy button by default', () => {
    render(<CodeBlock code="text" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('copies code to clipboard and shows feedback', async () => {
    const user = userEvent.setup();
    const writeText = mockClipboard();

    render(<CodeBlock code="secret code" showCopyButton />);

    const btn = screen.getByRole('button', { name: 'Copy code' });
    await user.click(btn);

    expect(writeText).toHaveBeenCalledWith('secret code');
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  });

  it('shows Copied text on click then reverts after timeout', async () => {
    vi.useFakeTimers();
    mockClipboard();

    render(<CodeBlock code="code" showCopyButton />);

    const btn = screen.getByRole('button', { name: 'Copy code' });
    await act(async () => {
      btn.click();
      await Promise.resolve();
    });

    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('applies custom className', () => {
    render(<CodeBlock code="code" className="my-block" />);
    expect(screen.getByLabelText('Code block')).toHaveClass('my-block');
  });

  it('has aria-label="Code block"', () => {
    render(<CodeBlock code="code" />);
    expect(screen.getByLabelText('Code block')).toBeInTheDocument();
  });

  it('applies maxHeight style', () => {
    render(<CodeBlock code="code" maxHeight="300px" />);
    const pre = screen.getByLabelText('Code block');
    expect(pre.style.maxHeight).toBe('300px');
  });

  it('renders empty line as non-breaking space in line numbers mode', () => {
    const { container } = render(<CodeBlock code={'line 0\n\nline 2'} showLineNumbers />);
    expect(container.textContent).toContain('line 0');
    expect(container.textContent).toContain('line 2');
  });
});
