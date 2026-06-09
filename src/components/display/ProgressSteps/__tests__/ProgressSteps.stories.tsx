import type { Meta, StoryObj } from '@storybook/react';
import { ProgressSteps } from '../ProgressSteps';

const meta: Meta<typeof ProgressSteps> = {
  title: 'Components/ProgressSteps',
  component: ProgressSteps,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['default', 'numbered', 'compact'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressSteps>;

const defaultSteps = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Set up your profile' },
  { title: 'Billing', description: 'Configure billing' },
  { title: 'Done', description: 'All set' },
];

export const Default: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 1,
  },
};

export const NumberedVertical: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 2,
    variant: 'numbered',
    orientation: 'vertical',
  },
};

export const CompactWithClick: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 2,
    variant: 'compact',
    onStepClick: (index: number) => console.log('Step clicked:', index),
  },
};
