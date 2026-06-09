import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ImageViewer } from '../ImageViewer';

const meta: Meta<typeof ImageViewer> = {
  title: 'Components/ImageViewer',
  component: ImageViewer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ImageViewer>;

const singleImage = [
  {
    src: 'https://picsum.photos/id/1015/800/600',
    alt: 'Mountain landscape',
    caption: 'A beautiful mountain landscape at sunset.',
  },
];

const multipleImages = [
  {
    src: 'https://picsum.photos/id/1015/800/600',
    alt: 'Mountain landscape',
    caption: 'Mountain view at sunset.',
  },
  {
    src: 'https://picsum.photos/id/1016/800/600',
    alt: 'Road in the woods',
    caption: 'A winding road through autumn forest.',
  },
  {
    src: 'https://picsum.photos/id/1018/800/600',
    alt: 'Mountain peak',
    caption: 'Snow-capped mountain peak.',
  },
];

export const WithSingleImage: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            padding: '8px 16px',
            background: 'var(--azimuth-color-primary)',
            color: 'var(--azimuth-color-on-primary)',
            border: 'none',
            borderRadius: 'var(--azimuth-radius-md)',
            cursor: 'pointer',
          }}
        >
          Open Image
        </button>
        <ImageViewer
          images={singleImage}
          open={open}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const WithMultipleImages: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            padding: '8px 16px',
            background: 'var(--azimuth-color-primary)',
            color: 'var(--azimuth-color-on-primary)',
            border: 'none',
            borderRadius: 'var(--azimuth-radius-md)',
            cursor: 'pointer',
          }}
        >
          Open Gallery
        </button>
        <ImageViewer
          images={multipleImages}
          open={open}
          onClose={() => setOpen(false)}
          showThumbnails
        />
      </div>
    );
  },
};

export const Empty: Story = {
  args: {
    images: [],
    open: true,
    onClose: () => console.log('Close'),
  },
};
