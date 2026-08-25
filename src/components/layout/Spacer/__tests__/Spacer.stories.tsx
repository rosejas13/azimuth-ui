import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from '../Spacer';
import { Button } from '../../../input/Button';

const meta: Meta<typeof Spacer> = {
  title: 'Components/Spacer',
  component: Spacer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Spacer>;

export const PushingButtonsApart: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button>Cancel</Button>
      <Spacer />
      <Button>Confirm</Button>
    </div>
  ),
};
