import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from '../Grid';

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--color-surface-2)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
}

const meta: Meta<typeof Grid> = {
  title: 'Components/Grid',
  component: Grid,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const TwoColumns: Story = {
  render: () => (
    <Grid cols={2}>
      <Cell>Item 1</Cell>
      <Cell>Item 2</Cell>
      <Cell>Item 3</Cell>
      <Cell>Item 4</Cell>
    </Grid>
  ),
};

export const ThreeColumns: Story = {
  render: () => (
    <Grid cols={3}>
      <Cell>Item 1</Cell>
      <Cell>Item 2</Cell>
      <Cell>Item 3</Cell>
      <Cell>Item 4</Cell>
      <Cell>Item 5</Cell>
      <Cell>Item 6</Cell>
    </Grid>
  ),
};

export const WithGap: Story = {
  render: () => (
    <Grid cols={2} gap="lg">
      <Cell>Item 1</Cell>
      <Cell>Item 2</Cell>
      <Cell>Item 3</Cell>
      <Cell>Item 4</Cell>
    </Grid>
  ),
};

export const HighlightVariant: Story = {
  render: () => (
    <Grid cols={3} variant="highlight">
      <Cell>Item 1</Cell>
      <Cell>Item 2</Cell>
      <Cell>Item 3</Cell>
    </Grid>
  ),
};
