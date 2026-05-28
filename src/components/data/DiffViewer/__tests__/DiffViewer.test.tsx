import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DiffViewer } from '../DiffViewer';

const oldCode = `function hello() {
  return "world";
}`;

const newCode = `function hello() {
  return "universe";
}

function goodbye() {
  return "all";
}`;

describe('DiffViewer', () => {
  it('has role="region" on root element', () => {
    render(<DiffViewer oldCode={oldCode} newCode={newCode} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('renders old and new code', () => {
    render(<DiffViewer oldCode={oldCode} newCode={newCode} />);
    expect(screen.getByText(/world/)).toBeInTheDocument();
    expect(screen.getByText(/universe/)).toBeInTheDocument();
  });

  it('shows additions and removals', () => {
    render(<DiffViewer oldCode={oldCode} newCode={newCode} />);

    // document.querySelectorAll('[class*="line"]');
    const addedLines = document.querySelectorAll('[class*="added"]');
    const removedLines = document.querySelectorAll('[class*="removed"]');
    expect(addedLines.length).toBeGreaterThan(0);
    expect(removedLines.length).toBeGreaterThan(0);
  });

  it('shows unified view by default', () => {
    render(<DiffViewer oldCode={oldCode} newCode={newCode} />);
    expect(screen.queryByText('Old')).not.toBeInTheDocument();
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('renders split view when splitView=true', () => {
    render(<DiffViewer oldCode={oldCode} newCode={newCode} splitView />);
    expect(screen.getByText('Old')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders line numbers when showLineNumbers=true', () => {
    render(<DiffViewer oldCode={oldCode} newCode={newCode} showLineNumbers />);
    const lineNums = document.querySelectorAll('[class*="lineNum"]');
    expect(lineNums.length).toBeGreaterThan(0);
  });

  it('applies maxHeight prop', () => {
    const { container } = render(
      <DiffViewer oldCode={oldCode} newCode={newCode} maxHeight="400px" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.maxHeight).toBe('400px');
  });

  it('shows addition count in header', () => {
    render(<DiffViewer oldCode={oldCode} newCode={newCode} />);
    const el = screen.getByText(/^\+\d+$/);
    expect(el).toBeInTheDocument();
  });

  it('shows deletion count in header', () => {
    render(<DiffViewer oldCode={oldCode} newCode={newCode} />);
    const el = screen.getByText(/^-\d+$/);
    expect(el).toBeInTheDocument();
  });

  it('shows language label', () => {
    render(
      <DiffViewer oldCode={oldCode} newCode={newCode} language="JavaScript" />,
    );
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('renders empty state when both strings are empty', () => {
    render(<DiffViewer oldCode="" newCode="" />);
    expect(document.querySelector('[class*="root"]')).toBeInTheDocument();
  });

  it('renders no diff lines when strings are identical', () => {
    const code = 'hello\nworld';
    render(<DiffViewer oldCode={code} newCode={code} />);
    const addedLines = document.querySelectorAll('[class*="added"]');
    const removedLines = document.querySelectorAll('[class*="removed"]');
    expect(addedLines.length).toBe(0);
    expect(removedLines.length).toBe(0);
  });

  it('hides line numbers when showLineNumbers is false', () => {
    render(<DiffViewer oldCode={oldCode} newCode={newCode} showLineNumbers={false} />);
    const lineNums = document.querySelectorAll('[class*="lineNum"]');
    expect(lineNums.length).toBe(0);
  });
});
