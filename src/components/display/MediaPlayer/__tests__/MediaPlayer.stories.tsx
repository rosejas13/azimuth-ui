import type { Meta, StoryObj } from '@storybook/react';
import { MediaPlayer } from '../MediaPlayer';

const meta: Meta<typeof MediaPlayer> = {
  title: 'Components/MediaPlayer',
  component: MediaPlayer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MediaPlayer>;

export const Default: Story = {
  args: {
    source: {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video',
    },
    dimensions: { width: '640px', height: '360px' },
  },
};

export const WithoutControls: Story = {
  args: {
    source: {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video',
    },
    playback: { controls: false },
    dimensions: { width: '640px', height: '360px' },
  },
};

export const WithCustomPoster: Story = {
  args: {
    source: {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video',
      poster:
        'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    },
    dimensions: { width: '640px', height: '360px' },
  },
};

export const Loading: Story = {
  args: {
    source: {
      src: 'https://example.com/very-large-video.mp4',
      type: 'video',
    },
    dimensions: { width: '640px', height: '360px' },
  },
};

export const Error: Story = {
  args: {
    source: {
      src: 'https://example.com/nonexistent-video.mp4',
      type: 'video',
    },
    dimensions: { width: '640px', height: '360px' },
  },
};
