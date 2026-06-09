import type { Meta, StoryObj } from '@storybook/react';
import { CodeBlock } from '../CodeBlock';

const meta: Meta<typeof CodeBlock> = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

const sampleCode = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const message = greet('World');
console.log(message);`;

export const Default: Story = {
  args: {
    code: sampleCode,
    language: 'typescript',
  },
};

export const WithLineNumbers: Story = {
  args: {
    code: sampleCode,
    language: 'typescript',
    showLineNumbers: true,
  },
};

export const WithCopyButton: Story = {
  args: {
    code: sampleCode,
    language: 'typescript',
    showCopyButton: true,
  },
};

export const AllFeatures: Story = {
  args: {
    code: sampleCode,
    language: 'typescript',
    showLineNumbers: true,
    showCopyButton: true,
  },
};
