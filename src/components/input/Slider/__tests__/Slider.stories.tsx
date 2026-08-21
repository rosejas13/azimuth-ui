import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '../Slider';

function SliderDemo() {
  const [value, setValue] = useState(50);
  return <Slider value={value} onChange={setValue} />;
}

function ValueDisplayDemo() {
  const [value, setValue] = useState(42);
  return (
    <Slider value={value} onChange={setValue} display={{ showValue: true }} />
  );
}

function VerticalDemo() {
  const [value, setValue] = useState(50);
  return (
    <div style={{ height: 200, display: 'flex', justifyContent: 'center' }}>
      <Slider
        value={value}
        onChange={setValue}
        display={{ orientation: 'vertical', showValue: true }}
      />
    </div>
  );
}

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    'display.orientation': {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    'display.size': { control: 'select', options: ['sm', 'md', 'lg'] },
  } as unknown as Meta<typeof Slider>['argTypes'],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => <SliderDemo />,
};

export const WithValueDisplay: Story = {
  render: () => <ValueDisplayDemo />,
};

export const Vertical: Story = {
  render: () => <VerticalDemo />,
};

export const SizeSm: Story = {
  args: { defaultValue: 30, display: { size: 'sm' } },
};

export const SizeMd: Story = {
  args: { defaultValue: 50, display: { size: 'md' } },
};

export const SizeLg: Story = {
  args: { defaultValue: 70, display: { size: 'lg' } },
};
