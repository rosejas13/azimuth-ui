import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { SuggestionsField } from '../SuggestionsField';

const skills = ['TypeScript', 'React', 'Vitest', 'Storybook', 'Node.js', 'CSS'];

const utilities = ['Electricity', 'Gas', 'Water', 'Internet', 'Trash'];

type StoryProps = Omit<
  ComponentProps<typeof SuggestionsField>,
  'values' | 'onChange'
> & {
  initialValues?: string[];
};

function SuggestionsStory(
  props: Omit<ComponentProps<typeof SuggestionsField>, 'values' | 'onChange'>,
) {
  const [values, setValues] = useState<string[]>([]);
  return <SuggestionsField values={values} onChange={setValues} {...props} />;
}

function SuggestionsInitialStory({ initialValues = [], ...rest }: StoryProps) {
  const [values, setValues] = useState<string[]>(initialValues);
  return <SuggestionsField values={values} onChange={setValues} {...rest} />;
}

const meta: Meta<typeof SuggestionsField> = {
  title: 'Components/SuggestionsField',
  component: SuggestionsField,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SuggestionsField>;

export const SuggestionsMode: Story = {
  render: () => (
    <SuggestionsStory
      label="Skills (pick from the list)"
      suggestions={{ options: skills }}
    />
  ),
};

export const FreeMode: Story = {
  render: () => (
    <SuggestionsStory
      mode="free"
      label="Tags (free text)"
      placeholder="Type and press Enter or comma"
    />
  ),
};

export const FixedMode: Story = {
  render: () => (
    <SuggestionsInitialStory
      mode="fixed"
      label="Utilities (click to toggle)"
      suggestions={{ options: utilities }}
      initialValues={['Gas', 'Water']}
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <SuggestionsStory
      label="Skills"
      error="Pick at least one skill."
      suggestions={{ options: skills }}
    />
  ),
};

export const MaxSelected: Story = {
  render: () => (
    <SuggestionsInitialStory
      label="Top 3 skills"
      suggestions={{ options: skills, max: 3 }}
      initialValues={['React', 'Vitest']}
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <SuggestionsInitialStory
      label="Skills"
      disabled
      initialValues={['React']}
    />
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SuggestionsStory label="Small" size="sm" />
      <SuggestionsStory label="Medium" />
      <SuggestionsStory label="Large" size="lg" />
    </div>
  ),
};
