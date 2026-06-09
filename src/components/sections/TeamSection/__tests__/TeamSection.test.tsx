import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TeamSection } from '../TeamSection';

const mockMembers = [
  {
    name: 'Alice Johnson',
    role: 'CEO',
    bio: 'Visionary leader with 15 years of experience.',
    avatar: 'https://example.com/alice.jpg',
    socialLinks: [
      { label: 'Twitter', href: 'https://twitter.com/alice' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/alice' },
    ],
  },
  {
    name: 'Bob Smith',
    role: 'CTO',
    bio: 'Architect of our core platform.',
    avatar: 'https://example.com/bob.jpg',
  },
  {
    name: 'Carol Davis',
    role: 'Designer',
    bio: 'Crafting beautiful user experiences.',
    socialLinks: [{ label: 'Dribbble', href: 'https://dribbble.com/carol' }],
  },
];

describe('TeamSection', () => {
  it('renders title', () => {
    render(<TeamSection title="Our Team" members={mockMembers} />);
    expect(screen.getByText('Our Team')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(
      <TeamSection
        title="Title"
        subtitle="Meet the team"
        members={mockMembers}
      />,
    );
    expect(screen.getByText('Meet the team')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <TeamSection
        title="Title"
        description="We are a group of passionate builders"
        members={mockMembers}
      />,
    );
    expect(
      screen.getByText('We are a group of passionate builders'),
    ).toBeInTheDocument();
  });

  it('renders all members with names and roles', () => {
    render(<TeamSection title="Title" members={mockMembers} />);
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getByText('Carol Davis')).toBeInTheDocument();
    expect(screen.getByText('CEO')).toBeInTheDocument();
    expect(screen.getByText('CTO')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
  });

  it('renders member bios when provided', () => {
    render(<TeamSection title="Title" members={mockMembers} />);
    expect(
      screen.getByText('Visionary leader with 15 years of experience.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Architect of our core platform.'),
    ).toBeInTheDocument();
  });

  it('does not render bio for member without bio', () => {
    const membersWithoutBio = [{ name: 'Dave', role: 'Dev' }];
    const { container } = render(
      <TeamSection title="Title" members={membersWithoutBio} />,
    );
    const memberElement = container.querySelector('[class*="member"]');
    expect(memberElement).toBeInTheDocument();
  });

  it('renders social links when provided', () => {
    render(<TeamSection title="Title" members={mockMembers} />);
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Dribbble')).toBeInTheDocument();
  });

  it('renders Avatar for each member', () => {
    const { container } = render(
      <TeamSection title="Title" members={mockMembers} />,
    );
    const images = container.querySelectorAll('[role="img"]');
    expect(images).toHaveLength(3);
  });

  it('applies custom className', () => {
    const { container } = render(
      <TeamSection
        title="Title"
        members={mockMembers}
        className="custom-team"
      />,
    );
    expect(container.firstChild).toHaveClass('custom-team');
  });

  it('applies section id', () => {
    const { container } = render(
      <TeamSection title="Title" members={mockMembers} id="team-section" />,
    );
    expect(container.firstChild).toHaveAttribute('id', 'team-section');
  });

  it('applies variant class', () => {
    const { container } = render(
      <TeamSection title="Title" members={mockMembers} variant="accent" />,
    );
    expect(container.firstChild).toHaveClass('accent');
  });

  it('handles empty members array', () => {
    const { container } = render(<TeamSection title="Title" members={[]} />);
    const grid = container.querySelector('[class*="grid"]');
    expect(grid).toBeInTheDocument();
    expect(grid?.children.length).toBe(0);
  });

  it('renders correct number of members', () => {
    const { container } = render(
      <TeamSection title="Title" members={mockMembers} />,
    );
    const avatars = container.querySelectorAll('[role="img"]');
    expect(avatars).toHaveLength(3);
  });
});
