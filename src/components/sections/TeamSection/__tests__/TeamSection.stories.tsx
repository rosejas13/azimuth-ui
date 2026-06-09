import type { Meta, StoryObj } from '@storybook/react';
import { TeamSection } from '../TeamSection';

const meta: Meta<typeof TeamSection> = {
  title: 'Sections/TeamSection',
  component: TeamSection,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TeamSection>;

const defaultMembers = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former CTO of Fintech Inc. Passionate about building products that make a difference.',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    socialLinks: [
      { label: 'Twitter', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
  },
  {
    name: 'Marcus Rivera',
    role: 'CTO & Co-Founder',
    bio: 'Distributed systems expert. Previously led engineering at ScaleUp.',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    socialLinks: [
      { label: 'Twitter', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
  },
  {
    name: 'Emily Park',
    role: 'Head of Design',
    bio: 'Design systems enthusiast with a keen eye for detail and usability.',
    avatar: 'https://i.pravatar.cc/150?u=emily',
    socialLinks: [{ label: 'Dribbble', href: '#' }],
  },
];

export const Default: Story = {
  args: {
    title: 'Meet Our Team',
    subtitle: 'People',
    description:
      'We are a diverse group of engineers, designers, and problem solvers.',
    members: defaultMembers,
  },
};

export const NoAvatars: Story = {
  args: {
    title: 'Leadership',
    subtitle: 'Team',
    members: [
      { name: 'Alex Turner', role: 'CEO' },
      { name: 'Jordan Lee', role: 'CTO' },
      { name: 'Taylor Kim', role: 'COO' },
    ],
  },
};

export const FourColumns: Story = {
  args: {
    title: 'Our Team',
    subtitle: 'People',
    members: [
      ...defaultMembers,
      {
        name: 'James Wilson',
        role: 'Engineering Lead',
        bio: 'Full-stack developer and open source contributor.',
        avatar: 'https://i.pravatar.cc/150?u=james',
      },
    ],
    columns: 4,
  },
};
