import type { Meta, StoryObj } from '@storybook/react';
import { DiffViewer } from '../DiffViewer';

const meta: Meta<typeof DiffViewer> = {
  title: 'Components/DiffViewer',
  component: DiffViewer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DiffViewer>;

export const SimpleDiff: Story = {
  args: {
    oldCode: 'Hello World',
    newCode: 'Hello Universe',
  },
};

export const AddedLines: Story = {
  args: {
    oldCode: 'Line one\nLine two',
    newCode: 'Line one\nLine two\nLine three\nLine four',
  },
};

export const MixedDiff: Story = {
  args: {
    oldCode: 'function greet(name) {\n  return "Hello, " + name;\n}',
    newCode:
      'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
  },
};

export const WithLanguage: Story = {
  args: {
    oldCode:
      'import { useState } from "react";\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;\n}',
    newCode:
      'import { useState, useCallback } from "react";\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  const increment = useCallback(() => setCount((c) => c + 1), []);\n  return <button onClick={increment}>{count}</button>;\n}',
    language: 'TypeScript',
  },
};

export const SplitView: Story = {
  args: {
    oldCode: 'const x = 42;\nconsole.log(x);',
    newCode: 'const x = 100;\nconsole.log(x);\nconsole.log(x * 2);',
    splitView: true,
  },
};

export const WithMaxHeight: Story = {
  args: {
    oldCode: Array.from(
      { length: 20 },
      (_, i) => `Line ${i + 1}: old content`,
    ).join('\n'),
    newCode: Array.from(
      { length: 20 },
      (_, i) => `Line ${i + 1}: new content v${i + 1}`,
    ).join('\n'),
    maxHeight: '200px',
  },
};
