import type { Meta, StoryObj } from '@storybook/react';
import { Testimonials } from '../Testimonials';

const meta: Meta<typeof Testimonials> = {
  title: 'Sections/Testimonials',
  component: Testimonials,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Testimonials>;

const defaultTestimonials = [
  {
    quote:
      'This platform has completely transformed how our team collaborates. The speed and reliability are unmatched.',
    author: 'Sarah Chen',
    role: 'VP of Engineering',
    company: 'TechCorp',
    avatar: 'https://i.pravatar.cc/100?u=sarah',
  },
  {
    quote:
      'We evaluated dozens of solutions and this was the clear winner. The API-first approach gave us the flexibility we needed.',
    author: 'Marcus Rivera',
    role: 'CTO',
    company: 'StartupXYZ',
    avatar: 'https://i.pravatar.cc/100?u=marcus',
  },
  {
    quote:
      'The support team is phenomenal. Every question was answered within minutes, and the product itself is rock solid.',
    author: 'Emily Watson',
    role: 'Product Manager',
    company: 'ScaleUp Inc',
    avatar: 'https://i.pravatar.cc/100?u=emily',
  },
];

export const Default: Story = {
  args: {
    title: 'What Our Customers Say',
    subtitle: 'Testimonials',
    testimonials: defaultTestimonials,
    columns: 2,
  },
};

export const ThreeColumns: Story = {
  args: {
    title: 'Loved by Teams Everywhere',
    testimonials: [
      ...defaultTestimonials,
      {
        quote:
          'Incredible value for money. We saw ROI within the first month of deployment.',
        author: 'David Kim',
        role: 'Engineering Lead',
        company: 'FinCo',
      },
      {
        quote:
          'The onboarding was seamless. Our entire team was up and running in under an hour.',
        author: 'Lisa Park',
        company: 'DataStream',
      },
      {
        quote:
          'Five stars all around. This is the gold standard for modern development tools.',
        author: 'James Wilson',
        role: 'Senior Developer',
        avatar: 'https://i.pravatar.cc/100?u=james',
      },
    ],
    columns: 3,
    rating: 5,
  },
};

export const DarkVariant: Story = {
  args: {
    title: 'Trusted by Industry Leaders',
    testimonials: defaultTestimonials,
    variant: 'dark',
    columns: 1,
    rating: 5,
  },
};
