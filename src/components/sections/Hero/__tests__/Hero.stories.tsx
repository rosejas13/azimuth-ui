import type { Meta, StoryObj } from '@storybook/react';
import { Hero } from '../Hero';

const meta: Meta<typeof Hero> = {
  title: 'Sections/Hero',
  component: Hero,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    title: 'Build Something Amazing',
    subtitle: 'A powerful platform for modern applications',
    description:
      'Azimuth provides the tools and infrastructure you need to build, deploy, and scale your applications with confidence.',
    primaryAction: { label: 'Get Started', href: '#' },
    secondaryAction: { label: 'Learn More', href: '#' },
  },
};

export const SplitWithMedia: Story = {
  args: {
    title: 'Feature-Rich Platform',
    subtitle: 'Everything you need in one place',
    description:
      'Our platform offers comprehensive solutions for teams of all sizes, from startups to enterprises.',
    primaryAction: { label: 'Get Started', href: '#' },
    secondaryAction: { label: 'Contact Sales', href: '#' },
    layout: 'split',
    media: {
      src: 'https://picsum.photos/seed/hero/600/400',
      alt: 'Platform screenshot',
    },
  },
};

export const DarkWithBackground: Story = {
  args: {
    title: 'Dark Mode Hero',
    subtitle: 'Stand out with a bold design',
    description:
      'A dark hero section with a background image creates a dramatic and engaging first impression for your users.',
    primaryAction: { label: 'Explore', href: '#' },
    variant: 'dark',
    backgroundImage: 'https://picsum.photos/seed/hero-dark/1600/900',
  },
};

export const Minimal: Story = {
  args: {
    title: 'Just the Title',
  },
};
