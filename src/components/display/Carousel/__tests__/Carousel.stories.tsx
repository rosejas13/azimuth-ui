import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from '../Carousel';

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
      <div style={{ padding: 40, background: '#2b4ace', color: '#fff' }}>
        Slide 1
      </div>
      <div style={{ padding: 40, background: '#166f48', color: '#fff' }}>
        Slide 2
      </div>
      <div style={{ padding: 40, background: '#5c2c02', color: '#fff' }}>
        Slide 3
      </div>
    </Carousel>
  ),
};

export const NoArrows: Story = {
  render: () => (
    <Carousel showArrows={false}>
      <div style={{ padding: 40, background: '#2b4ace', color: '#fff' }}>
        Slide 1
      </div>
      <div style={{ padding: 40, background: '#166f48', color: '#fff' }}>
        Slide 2
      </div>
      <div style={{ padding: 40, background: '#5c2c02', color: '#fff' }}>
        Slide 3
      </div>
    </Carousel>
  ),
};

export const NoDots: Story = {
  render: () => (
    <Carousel showDots={false}>
      <div style={{ padding: 40, background: '#2b4ace', color: '#fff' }}>
        Slide 1
      </div>
      <div style={{ padding: 40, background: '#166f48', color: '#fff' }}>
        Slide 2
      </div>
      <div style={{ padding: 40, background: '#5c2c02', color: '#fff' }}>
        Slide 3
      </div>
    </Carousel>
  ),
};
