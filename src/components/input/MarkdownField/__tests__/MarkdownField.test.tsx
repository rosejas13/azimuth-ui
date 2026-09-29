import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MarkdownField } from '../MarkdownField';
import { safeHref } from '../markdown';
import { InputConfigProvider } from '../../input-config';

describe('MarkdownField renderer', () => {
  const previewOf = (md: string) => {
    const utils = render(<MarkdownField mode="preview" value={md} />);
    return utils.getByTestId('markdown-preview');
  };

  it('renders ATX headings h1-h6', () => {
    const md = [
      '# One',
      '## Two',
      '### Three',
      '#### Four',
      '##### Five',
      '###### Six',
    ].join('\n');
    const preview = previewOf(md);
    for (let level = 1; level <= 6; level++) {
      expect(preview.querySelector(`h${level}`)).not.toBeNull();
    }
  });

  it('renders bold and italic inline marks', () => {
    const preview = previewOf('**bold** and *italic* and _under_');
    expect(preview.querySelector('strong')).toHaveTextContent('bold');
    expect(preview.querySelectorAll('em')).toHaveLength(2);
  });

  it('renders a link with target and rel hardening', () => {
    const preview = previewOf('[docs](https://example.com)');
    const a = preview.querySelector('a');
    expect(a).not.toBeNull();
    expect(a).toHaveAttribute('href', 'https://example.com');
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('drops links with unsafe schemes (label degrades to text)', () => {
    const preview = previewOf('[click](javascript:alert(1))');
    expect(preview.querySelector('a')).toBeNull();
    expect(preview.textContent).toContain('click');
  });

  it('renders fenced code blocks with text content (escaped, not HTML)', () => {
    const preview = previewOf('```\n<b>not html</b>\n```');
    const pre = preview.querySelector('pre');
    expect(pre).not.toBeNull();
    expect(pre?.querySelector('code')?.textContent).toBe('<b>not html</b>');
    // Raw HTML never becomes an element in the preview DOM.
    expect(preview.querySelector('b')).toBeNull();
  });

  it('renders unordered and ordered lists', () => {
    const preview = previewOf('- one\n- two\n\n1. first\n2. second');
    expect(preview.querySelectorAll('ul > li')).toHaveLength(2);
    expect(preview.querySelectorAll('ol > li')).toHaveLength(2);
  });

  it('renders blockquotes', () => {
    const preview = previewOf('> quoted line');
    expect(preview.querySelector('blockquote')).toHaveTextContent(
      'quoted line',
    );
  });

  it('parses to nodes, never raw HTML (no dangerouslySetInnerHTML in preview)', () => {
    const preview = previewOf('Para with <script>alert(1)</script> text');
    // The script tag must be literal text, not an element.
    expect(preview.querySelector('script')).toBeNull();
    expect(preview.textContent).toContain('<script>alert(1)</script>');
  });

  it('renders unsupported syntax as plain text', () => {
    const preview = previewOf('| a | b |\n|---|---|');
    // No table element is emitted; the pipe row survives as text.
    expect(preview.querySelector('table')).toBeNull();
    expect(preview.textContent).toContain('| a | b |');
  });

  it('emits a hard break for newlines inside a paragraph', () => {
    const preview = previewOf('first line\nsecond line');
    const p = preview.querySelector('p');
    expect(p?.querySelectorAll('br')).toHaveLength(1);
    expect(p?.textContent).toContain('second line');
  });
});

describe('MarkdownField mode semantics', () => {
  it('defaults to write mode: a labeled textarea, no preview', () => {
    render(<MarkdownField label="Notes" defaultValue="hello" />);
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-preview')).toBeNull();
  });

  it('preview mode renders the parsed value instead of the textarea', () => {
    render(<MarkdownField mode="preview" label="Notes" value="# Title" />);
    expect(screen.queryByRole('textbox')).toBeNull();
    const preview = screen.getByTestId('markdown-preview');
    expect(preview.querySelector('h1')).toHaveTextContent('Title');
  });

  it('split mode shows editor and preview columns together', () => {
    render(<MarkdownField mode="split" label="Notes" value="- item" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    const preview = screen.getByTestId('markdown-preview');
    expect(preview.querySelectorAll('li')).toHaveLength(1);
  });

  it('marks the preview region aria-live=polite for mode toggling', () => {
    render(<MarkdownField mode="preview" value="text" />);
    expect(screen.getByTestId('markdown-preview')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  it('update flows back: controlled onChange then preview reflects it', async () => {
    const handle = vi.fn();
    const { rerender } = render(<MarkdownField value="a" onChange={handle} />);
    await userEvent.type(screen.getByRole('textbox'), 'b');
    expect(handle).toHaveBeenLastCalledWith('ab');
    rerender(<MarkdownField value="ab" onChange={handle} mode="preview" />);
    expect(screen.getByTestId('markdown-preview').textContent).toBe('ab');
  });
});

describe('MarkdownField toolbar', () => {
  it('renders default buttons with aria-labels', () => {
    render(<MarkdownField toolbar />);
    expect(
      screen.getByRole('toolbar', { name: 'Formatting' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Link' })).toBeInTheDocument();
  });

  it('toolbar off renders no toolbar', () => {
    render(<MarkdownField toolbar={false} />);
    expect(screen.queryByRole('toolbar')).toBeNull();
  });

  it('inserts markers around the selection via selectionStart', async () => {
    const user = userEvent.setup();
    render(<MarkdownField defaultValue="hello world" />);
    const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
    textarea.focus();
    textarea.setSelectionRange(0, 5);
    await user.click(screen.getByRole('button', { name: 'Bold' }));
    expect(textarea).toHaveValue('**hello** world');
    // Caret parked after the inserted span, restored asynchronously.
    await waitFor(() => {
      expect(textarea.selectionStart).toBe(9);
      expect(textarea).toHaveFocus();
    });
  });

  it('inserts at the caret when nothing is selected', async () => {
    const user = userEvent.setup();
    render(<MarkdownField defaultValue="ab" />);
    const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
    textarea.focus();
    textarea.setSelectionRange(1, 1);
    await user.click(screen.getByRole('button', { name: 'Code' }));
    expect(textarea).toHaveValue('a``b');
  });

  it('toolbar does not steal focus from the textarea', () => {
    render(<MarkdownField defaultValue="v" />);
    const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
    textarea.focus();
    screen.getByRole('button', { name: 'Bold' }).click();
    expect(textarea).toHaveFocus();
  });
});

describe('MarkdownField wiring', () => {
  it('wires error message with role alert and aria-invalid', () => {
    render(<MarkdownField label="Notes" error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies size from InputConfigProvider', () => {
    render(
      <div className="probe">
        <InputConfigProvider value={{ size: 'lg' }}>
          <MarkdownField label="Notes" />
        </InputConfigProvider>
      </div>,
    );
    expect(document.querySelector('.lg')).toBeInTheDocument();
  });

  it('honors rows and maxLength/showCharCount', () => {
    render(
      <MarkdownField
        label="Notes"
        rows={7}
        maxLength={40}
        showCharCount
        value="x"
      />,
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '7');
    expect(screen.getByText('1/40')).toBeInTheDocument();
  });

  it('curated containerProps escape hatch passes through (containerProps passthrough by textareaProps)', () => {
    render(
      <MarkdownField
        data-testid="by-passthrough"
        textareaProps={{ 'data-escape': 'hatch' }}
      />,
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('data-escape', 'hatch');
  });

  it('rewrites user typing through onChange as markdown source', async () => {
    const handle = vi.fn();
    const user = userEvent.setup();
    render(<MarkdownField onChange={handle} defaultValue="" />);
    await user.type(screen.getByRole('textbox'), 'ok');
    expect(handle).toHaveBeenCalledTimes(2);
    expect(handle).toHaveBeenLastCalledWith('ok');
  });

  it('disabled hides toolbar and disables the textarea', () => {
    render(<MarkdownField disabled defaultValue="v" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.queryByRole('toolbar')).toBeNull();
  });
});

describe('MarkdownField safeHref', () => {
  it('allows http, https, mailto', () => {
    expect(safeHref('https://x.com')).toBe('https://x.com');
    expect(safeHref('http://x.com')).toBe('http://x.com');
    expect(safeHref('mailto:a@b.c')).toBe('mailto:a@b.c');
  });

  it('rejects unsafe schemes and defeats control-char obfuscation', () => {
    expect(safeHref('javascript:alert(1)')).toBeUndefined();
    expect(safeHref('data:text/html,x')).toBeUndefined();
    expect(safeHref('java\tscript:alert(1)')).toBeUndefined();
    expect(safeHref('relative/path')).toBeUndefined();
  });
});

describe('preview DOM invariants', () => {
  it('preview children are parse output; empty text does not crash', async () => {
    const { rerender } = render(<MarkdownField mode="preview" value="" />);
    expect(screen.getByTestId('markdown-preview').textContent).toContain(
      'Nothing to preview',
    );
    rerender(<MarkdownField mode="preview" value="**b** `c`" />);
    await waitFor(() => {
      expect(screen.getByTestId('markdown-preview').textContent).toBe('b c');
    });
  });
});
