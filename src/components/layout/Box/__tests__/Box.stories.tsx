import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../Box';
import { Stack } from '../../Stack';

const meta: Meta<typeof Box> = {
  title: 'Components/Box',
  component: Box,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Box>;

export const OptInVariants: Story = {
  render: () => (
    <Stack direction="horizontal" spacing="lg">
      <Box padding="lg">Padded only</Box>
      <Box padding="lg" radius="md" background="subtle">
        Subtle surface
      </Box>
      <Box padding="lg" border radius="lg" background="surface" shadow="md">
        Fully dressed card
      </Box>
    </Stack>
  ),
};
