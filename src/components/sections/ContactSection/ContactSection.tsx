'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from 'react';
import { cn } from '@/utils/cn';
import { Container } from '@/components/layout';
import { Text } from '@/components/display';
import { Input, TextArea, Button } from '@/components/input';
import styles from './ContactSection.module.css';

/** Contact information displayed in the sidebar */
export interface ContactInfo {
  address?: string;
  email?: string;
  phone?: string;
  socialLinks?: Array<{ label: string; href: string; icon?: ReactNode }>;
}

/** Contact form section with input fields and contact details sidebar */
export interface ContactSectionProps extends Omit<
  ComponentPropsWithoutRef<'section'>,
  'onSubmit'
> {
  title?: string;
  subtitle?: string;
  description?: string;
  contactInfo?: ContactInfo;
  onSubmit?: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => void;
  submitState?: 'idle' | 'submitting' | 'success' | 'error';
  variant?: 'default' | 'accent' | 'dark' | 'muted';
  id?: string;
  className?: string;
}

/** A contact form section with input fields (name, email, subject, message) and an optional contact info sidebar. */
export const ContactSection = forwardRef<HTMLElement, ContactSectionProps>(
  (
    {
      title,
      subtitle,
      description,
      contactInfo,
      onSubmit,
      submitState = 'idle',
      variant = 'default',
      id,
      className,
      ...props
    },
    ref,
  ) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!onSubmit) return;
      const form = e.currentTarget;
      const formData = new FormData(form);
      onSubmit({
        name: (formData.get('name') as string) || '',
        email: (formData.get('email') as string) || '',
        subject: (formData.get('subject') as string) || '',
        message: (formData.get('message') as string) || '',
      });
    };

    return (
      <section
        ref={ref}
        id={id}
        className={cn(styles.section, styles[variant], className)}
        {...props}
      >
        <Container size="lg">
          {(title || subtitle || description) && (
            <header className={styles.header}>
              {subtitle && (
                <Text
                  as="p"
                  size="sm"
                  variant="heading"
                  color="accent"
                  className={styles.subtitle}
                >
                  {subtitle}
                </Text>
              )}
              {title && <h2 className={styles.title}>{title}</h2>}
              {description && (
                <Text as="p" size="base">
                  {description}
                </Text>
              )}
            </header>
          )}
          <div className={styles.grid}>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <Input
                label="Name"
                name="name"
                placeholder="Your name"
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
              <Input
                label="Subject"
                name="subject"
                placeholder="How can we help?"
              />
              <TextArea
                label="Message"
                name="message"
                placeholder="Tell us more about your inquiry..."
                rows={5}
                required
              />
              <div role="status" aria-live="polite" className={styles.status}>
                {submitState !== 'idle' && (
                  <span className={styles.srOnly}>
                    {submitState === 'submitting'
                      ? 'Sending message'
                      : submitState === 'success'
                        ? 'Message sent successfully'
                        : 'Failed to send. Please try again'}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitState === 'submitting'}
              >
                {submitState === 'submitting'
                  ? 'Sending...'
                  : submitState === 'success'
                    ? 'Sent!'
                    : submitState === 'error'
                      ? 'Try Again'
                      : 'Send Message'}
              </Button>
            </form>
            {contactInfo && (
              <aside className={styles.info}>
                {contactInfo.address && (
                  <div className={styles.infoItem}>
                    <Text as="p" size="sm" variant="heading" weight="semibold">
                      Address
                    </Text>
                    <Text as="p" size="base">
                      {contactInfo.address}
                    </Text>
                  </div>
                )}
                {contactInfo.email && (
                  <div className={styles.infoItem}>
                    <Text as="p" size="sm" variant="heading" weight="semibold">
                      Email
                    </Text>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className={styles.link}
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className={styles.infoItem}>
                    <Text as="p" size="sm" variant="heading" weight="semibold">
                      Phone
                    </Text>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className={styles.link}
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                )}
                {contactInfo.socialLinks &&
                  contactInfo.socialLinks.length > 0 && (
                    <div className={styles.infoItem}>
                      <Text
                        as="p"
                        size="sm"
                        variant="heading"
                        weight="semibold"
                      >
                        Follow Us
                      </Text>
                      <div className={styles.socialLinks}>
                        {contactInfo.socialLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.href}
                            className={styles.socialLink}
                            aria-label={link.label}
                          >
                            {link.icon}
                            <span>{link.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
              </aside>
            )}
          </div>
        </Container>
      </section>
    );
  },
);

ContactSection.displayName = 'ContactSection';
