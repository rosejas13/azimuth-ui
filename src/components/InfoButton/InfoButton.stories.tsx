import type { Meta, StoryObj } from '@storybook/react';
import { InfoButton } from './InfoButton';

const meta: Meta<typeof InfoButton> = {
  title: 'Components/InfoButton',
  component: InfoButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InfoButton>;

function Wrapper(props: React.ComponentProps<typeof InfoButton>) {
  return (
    <div style={{ padding: '120px', display: 'flex', justifyContent: 'center' }}>
      <InfoButton {...props} />
    </div>
  );
}

export const Basic: Story = {
  render: () => <Wrapper content="Helpful information about this feature." />,
};

export const WithTitle: Story = {
  render: () => (
    <Wrapper content="Helpful information about this feature." title="Usage Tips" />
  ),
};

export const PlacementTop: Story = {
  render: () => <Wrapper content="Appears above the trigger." placement="top" />,
};

export const PlacementBottom: Story = {
  render: () => <Wrapper content="Appears below the trigger." placement="bottom" />,
};

export const PlacementLeft: Story = {
  render: () => <Wrapper content="Appears to the left." placement="left" />,
};

export const PlacementRight: Story = {
  render: () => <Wrapper content="Appears to the right." placement="right" />,
};

export const ShowOnHover: Story = {
  render: () => <Wrapper content="Revealed on hover instead of click." showOnHover />,
};
