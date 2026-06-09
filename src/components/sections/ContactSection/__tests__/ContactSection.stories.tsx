import type { Meta, StoryObj } from '@storybook/react';
import { ContactSection } from '../ContactSection';

const meta: Meta<typeof ContactSection> = {
  title: 'Sections/ContactSection',
  component: ContactSection,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContactSection>;

const defaultContactInfo = {
  address: '123 Innovation Drive, San Francisco, CA 94105',
  email: 'hello@azimuth.dev',
  phone: '+1 (555) 123-4567',
  socialLinks: [
    { label: 'Twitter', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
};

export const Default: Story = {
  args: {
    title: 'Get in Touch',
    subtitle: 'Contact',
    description:
      'Have a question or want to learn more? We would love to hear from you.',
    contactInfo: defaultContactInfo,
  },
};

export const Minimal: Story = {
  args: {
    title: 'Send Us a Message',
    subtitle: 'Contact',
  },
};

export const Error: Story = {
  args: {
    title: 'Contact Us',
    subtitle: 'Support',
    contactInfo: defaultContactInfo,
    submitState: 'error',
  },
};
