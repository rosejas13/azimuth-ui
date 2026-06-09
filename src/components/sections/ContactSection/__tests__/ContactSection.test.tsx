import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactSection } from '../ContactSection';

const defaultContactInfo = {
  address: '123 Main St, City',
  email: 'hello@example.com',
  phone: '+1 555-0000',
  socialLinks: [
    { label: 'Twitter', href: 'https://twitter.com/example' },
    { label: 'GitHub', href: 'https://github.com/example' },
  ],
};

describe('ContactSection', () => {
  it('renders title', () => {
    render(<ContactSection title="Contact Us" />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<ContactSection title="Title" subtitle="Get in touch" />);
    expect(screen.getByText('Get in touch')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <ContactSection
        title="Title"
        description="We would love to hear from you"
      />,
    );
    expect(
      screen.getByText('We would love to hear from you'),
    ).toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(<ContactSection title="Title" />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('renders contact info when provided', () => {
    render(<ContactSection title="Title" contactInfo={defaultContactInfo} />);
    expect(screen.getByText('123 Main St, City')).toBeInTheDocument();
    expect(screen.getByText('hello@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1 555-0000')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<ContactSection title="Title" contactInfo={defaultContactInfo} />);
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
  });

  it('does not render contact info section when not provided', () => {
    const { container } = render(<ContactSection title="Title" />);
    const aside = container.querySelector('aside');
    expect(aside).not.toBeInTheDocument();
  });

  it('calls onSubmit with form data when submitted', () => {
    const onSubmit = vi.fn();
    render(<ContactSection title="Title" onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'jane@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Subject'), {
      target: { value: 'Hello' },
    });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Hi there' },
    });

    fireEvent.submit(
      screen.getByRole('button', { name: /send message/i }).closest('form')!,
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Jane',
      email: 'jane@test.com',
      subject: 'Hello',
      message: 'Hi there',
    });
  });

  it('shows submitting state text', () => {
    render(<ContactSection title="Title" submitState="submitting" />);
    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });

  it('shows success state text', () => {
    render(<ContactSection title="Title" submitState="success" />);
    expect(screen.getByText('Sent!')).toBeInTheDocument();
  });

  it('shows error state text', () => {
    render(<ContactSection title="Title" submitState="error" />);
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ContactSection title="Title" className="custom-contact" />,
    );
    expect(container.firstChild).toHaveClass('custom-contact');
  });

  it('applies section id', () => {
    const { container } = render(
      <ContactSection title="Title" id="contact-section" />,
    );
    expect(container.firstChild).toHaveAttribute('id', 'contact-section');
  });

  it('applies variant class', () => {
    const { container } = render(
      <ContactSection title="Title" variant="muted" />,
    );
    expect(container.firstChild).toHaveClass('muted');
  });
});
