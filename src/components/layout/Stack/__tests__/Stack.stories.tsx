import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '../Stack';
import { Divider } from '../../Divider';

function Box({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--color-surface-2)',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
}

const meta: Meta<typeof Stack> = {
  title: 'Components/Stack',
  component: Stack,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Vertical: Story = {
  render: () => (
    <Stack>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Stack direction="horizontal">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const WithSpacing: Story = {
  render: () => (
    <Stack spacing="xl">
      <Box>Spaced apart</Box>
      <Box>Spaced apart</Box>
      <Box>Spaced apart</Box>
    </Stack>
  ),
};

export const WithDividers: Story = {
  render: () => (
    <Stack>
      <Box>Item 1</Box>
      <Divider />
      <Box>Item 2</Box>
      <Divider />
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const CenterAligned: Story = {
  render: () => (
    <Stack align="center">
      <Box>Short</Box>
      <Box>Much longer content</Box>
      <Box>Short</Box>
    </Stack>
  ),
};
