import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ColorPicker } from '../ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  render: function Render() {
    const [color, setColor] = useState('#3b82f6');
    return (
      <ColorPicker
        value={color}
        onChange={setColor}
        presets={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
      />
    );
  },
};

export const CustomPresets: Story = {
  render: function Render() {
    const [color, setColor] = useState('#ff6b6b');
    return (
      <ColorPicker
        value={color}
        onChange={setColor}
        presets={[
          '#ff6b6b',
          '#ffd93d',
          '#6bcb77',
          '#4d96ff',
          '#9b59b6',
          '#e17055',
        ]}
      />
    );
  },
};

export const WithoutInput: Story = {
  render: function Render() {
    const [color, setColor] = useState('#3b82f6');
    return (
      <ColorPicker
        value={color}
        onChange={setColor}
        presets={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
        showInput={false}
      />
    );
  },
};

export const Compact: Story = {
  render: function Render() {
    const [color, setColor] = useState('#3b82f6');
    return (
      <ColorPicker
        value={color}
        onChange={setColor}
        presets={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
        size="sm"
      />
    );
  },
};
