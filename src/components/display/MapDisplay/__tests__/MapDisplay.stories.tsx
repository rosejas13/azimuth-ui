import type { Meta, StoryObj } from '@storybook/react';
import { MapDisplay } from '../MapDisplay';

const meta: Meta<typeof MapDisplay> = {
  title: 'Components/MapDisplay',
  component: MapDisplay,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MapDisplay>;

export const Default: Story = {
  args: {},
};

export const WithMarkers: Story = {
  args: {
    dimensions: { height: '350px', width: '100%' },
    state: {
      center: { lat: 51.5074, lng: -0.1278 },
      zoom: 10,
      markers: [
        { position: { lat: 51.5074, lng: -0.1278 }, label: 'London' },
        { position: { lat: 51.752, lng: -1.2577 }, label: 'Oxford' },
        { position: { lat: 51.4545, lng: -2.5879 }, label: 'Bristol' },
      ],
    },
  },
};

export const WithEmbeddedMap: Story = {
  args: {
    dimensions: { height: '400px', width: '100%' },
    source: {
      src: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.1%2C51.5%2C0.1%2C51.52&layer=mapnik',
      title: 'London Map',
      interactive: true,
    },
    state: {
      center: { lat: 51.5074, lng: -0.1278 },
      zoom: 12,
    },
  },
};

export const Error: Story = {
  args: {
    dimensions: { height: '300px', width: '100%' },
    source: {
      src: 'not-a-valid-url',
      title: 'Broken Map',
    },
  },
};
