import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from './Carousel';

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Basic: Story = {
  render: () => (
    <Carousel>
      <div style={{ padding: 40, background: '#4f6ef7', color: '#fff' }}>Slide 1</div>
      <div style={{ padding: 40, background: '#22b573', color: '#fff' }}>Slide 2</div>
      <div style={{ padding: 40, background: '#e67e22', color: '#fff' }}>Slide 3</div>
    </Carousel>
  ),
};

export const NoArrows: Story = {
  render: () => (
    <Carousel showArrows={false}>
      <div style={{ padding: 40, background: '#4f6ef7', color: '#fff' }}>Slide 1</div>
      <div style={{ padding: 40, background: '#22b573', color: '#fff' }}>Slide 2</div>
      <div style={{ padding: 40, background: '#e67e22', color: '#fff' }}>Slide 3</div>
    </Carousel>
  ),
};

export const NoDots: Story = {
  render: () => (
    <Carousel showDots={false}>
      <div style={{ padding: 40, background: '#4f6ef7', color: '#fff' }}>Slide 1</div>
      <div style={{ padding: 40, background: '#22b573', color: '#fff' }}>Slide 2</div>
      <div style={{ padding: 40, background: '#e67e22', color: '#fff' }}>Slide 3</div>
    </Carousel>
  ),
};
