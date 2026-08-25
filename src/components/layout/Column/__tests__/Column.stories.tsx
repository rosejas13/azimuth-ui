import type { Meta, StoryObj } from '@storybook/react';
import { Column } from '../Column';
import { Text } from '../../../display/Text';
import { Badge } from '../../../display/Badge';

const meta: Meta<typeof Column> = {
  title: 'Components/Column',
  component: Column,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Column>;

export const WithTextAndBadges: Story = {
  render: () => (
    <Column gap="sm">
      <Text size="lg" weight="semibold">
        Deploy pipeline
      </Text>
      <Text color="muted">
        Last run completed 4 minutes ago across all environments.
      </Text>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Badge variant="success">Passed</Badge>
        <Badge variant="info">Staging</Badge>
        <Badge variant="neutral">v2.14.0</Badge>
      </div>
    </Column>
  ),
};
