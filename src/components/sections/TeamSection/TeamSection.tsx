import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Container } from '@/components/layout';
import { Text } from '@/components/display';
import { Avatar } from '@/components/display';
import styles from './TeamSection.module.css';

/** A single team member entry */
export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  socialLinks?: Array<{ label: string; href: string }>;
}

/** Team section displaying members in a configurable grid */
export interface TeamSectionProps extends ComponentPropsWithoutRef<'section'> {
  title?: string;
  subtitle?: string;
  description?: string;
  members: TeamMember[];
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'accent' | 'dark' | 'muted';
  id?: string;
  className?: string;
}

export const TeamSection = forwardRef<HTMLElement, TeamSectionProps>(
  (
    {
      title,
      subtitle,
      description,
      members,
      columns = 3,
      variant = 'default',
      id,
      className,
      ...props
    },
    ref,
  ) => {
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
          <div className={cn(styles.grid, styles[`cols-${columns}`])}>
            {members.map((member, index) => (
              <div key={index} className={styles.member}>
                <Avatar
                  src={member.avatar}
                  alt={member.name}
                  fallback={member.name}
                  size="xl"
                />
                <h3 className={styles.memberName}>{member.name}</h3>
                <Text as="p" size="sm" variant="heading" color="accent">
                  {member.role}
                </Text>
                {member.bio && (
                  <Text as="p" size="sm" className={styles.bio}>
                    {member.bio}
                  </Text>
                )}
                {member.socialLinks && member.socialLinks.length > 0 && (
                  <div className={styles.socialLinks}>
                    {member.socialLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        className={styles.socialLink}
                        aria-label={link.label}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  },
);

TeamSection.displayName = 'TeamSection';
