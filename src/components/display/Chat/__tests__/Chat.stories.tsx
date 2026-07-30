import type { Meta, StoryObj } from '@storybook/react';
import { Chat } from '../Chat';

const meta: Meta<typeof Chat> = {
  title: 'Components/Chat',
  component: Chat,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Chat>;

export const Default: Story = {
  args: {
    messages: [],
    onSend: (text: string) => console.log('Send:', text),
  },
};

export const WithMessages: Story = {
  args: {
    messages: [
      {
        id: '1',
        text: 'Hey, how are you?',
        sender: 'user',
        timestamp: new Date(),
      },
      {
        id: '2',
        text: "I'm doing great! How about you?",
        sender: 'other',
        timestamp: new Date(),
      },
      {
        id: '3',
        text: 'Working on some new features for the app.',
        sender: 'user',
        timestamp: new Date(),
      },
      {
        id: '4',
        text: 'That sounds awesome! Let me know if you need any help.',
        sender: 'other',
        timestamp: new Date(),
      },
    ],
    onSend: (text: string) => console.log('Send:', text),
  },
};

export const CustomPlaceholder: Story = {
  args: {
    messages: [],
    placeholder: 'Ask me anything...',
    onSend: (text: string) => console.log('Send:', text),
  },
};

export const CustomHeaderAndEmptyState: Story = {
  args: {
    messages: [],
    title: 'Spanish Tutor',
    headerActions: (
      <button type="button" style={{ fontSize: 12 }}>
        Settings
      </button>
    ),
    emptyState: '¡Hola! Ask me anything to start practicing.',
    onSend: (text: string) => console.log('Send:', text),
  },
};

export const CustomBubbleContent: Story = {
  args: {
    messages: [
      { id: '1', text: 'Yo quiero practicar', sender: 'user' },
      {
        id: '2',
        text: 'Great! A small correction below.',
        sender: 'other',
      },
    ],
    renderMessage: (msg) =>
      msg.sender === 'other' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span>{msg.text}</span>
          <span
            style={{
              fontSize: 13,
              padding: '4px 8px',
              borderRadius: 6,
              background: 'rgba(0,0,0,0.08)',
            }}
          >
            ✏️ «quiero» → «quisiera» (more polite)
          </span>
          <button
            type="button"
            style={{ alignSelf: 'flex-start', fontSize: 12 }}
          >
            🔊 Speak
          </button>
        </div>
      ) : (
        msg.text
      ),
    onSend: (text: string) => console.log('Send:', text),
  },
};

export const NoHeader: Story = {
  args: {
    messages: [
      { id: '1', text: 'This chat has no built-in header.', sender: 'other' },
    ],
    hideHeader: true,
    onSend: (text: string) => console.log('Send:', text),
  },
};

export const WithTimestamps: Story = {
  args: {
    messages: [
      {
        id: '1',
        text: 'Meeting at 3pm?',
        sender: 'user',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: '2',
        text: 'Sure, see you then!',
        sender: 'other',
        timestamp: new Date(Date.now() - 1800000),
      },
      {
        id: '3',
        text: "Don't forget the slides.",
        sender: 'user',
        timestamp: new Date(Date.now() - 600000),
      },
    ],
    onSend: (text: string) => console.log('Send:', text),
  },
};
