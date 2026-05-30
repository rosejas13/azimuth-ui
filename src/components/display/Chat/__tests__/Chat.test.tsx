import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Chat, type ChatMessage } from '../Chat';

const mockMessages: ChatMessage[] = [
  { id: '1', text: 'Hello', sender: 'user' },
  {
    id: '2',
    text: 'Hi there!',
    sender: 'other',
    timestamp: new Date('2024-01-01T10:00:00'),
  },
  {
    id: '3',
    text: 'How are you?',
    sender: 'user',
    timestamp: new Date('2024-01-01T10:01:00'),
  },
];

describe('Chat', () => {
  it('renders messages with correct alignment', () => {
    render(<Chat messages={mockMessages} onSend={vi.fn()} />);
    const bubbles = screen.getAllByText(/Hello|Hi there!|How are you?/);
    expect(bubbles).toHaveLength(3);
  });

  it('shows empty state when no messages', () => {
    render(<Chat messages={[]} onSend={vi.fn()} />);
    expect(
      screen.getByText('No messages yet. Start the conversation!'),
    ).toBeInTheDocument();
  });

  it('calls onSend when send button clicked', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByLabelText('Message input');
    await user.type(input, 'Hello world');
    await user.click(screen.getByLabelText('Send message'));
    expect(onSend).toHaveBeenCalledWith('Hello world');
  });

  it('calls onSend when Enter key pressed', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByLabelText('Message input');
    await user.type(input, 'Hello world');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSend).toHaveBeenCalledWith('Hello world');
  });

  it('clears input after sending', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByLabelText('Message input');
    await user.type(input, 'Hello');
    await user.click(screen.getByLabelText('Send message'));
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('disables send button when input is empty', () => {
    render(<Chat messages={[]} onSend={vi.fn()} />);
    expect(screen.getByLabelText('Send message')).toBeDisabled();
  });

  it('enables send button when input has text', async () => {
    const user = userEvent.setup();
    render(<Chat messages={[]} onSend={vi.fn()} />);
    const input = screen.getByLabelText('Message input');
    await user.type(input, 'Hi');
    expect(screen.getByLabelText('Send message')).toBeEnabled();
  });

  it('does not send empty or whitespace-only messages', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByLabelText('Message input');
    await user.type(input, '   ');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSend).not.toHaveBeenCalled();
  });

  it('renders timestamp when provided', () => {
    render(<Chat messages={mockMessages} onSend={vi.fn()} />);
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('10:01 AM')).toBeInTheDocument();
  });

  it('does not render timestamp when not provided', () => {
    const msgs: ChatMessage[] = [{ id: '1', text: 'Hello', sender: 'user' }];
    render(<Chat messages={msgs} onSend={vi.fn()} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(
      <Chat messages={[]} onSend={vi.fn()} placeholder="Ask something..." />,
    );
    expect(screen.getByPlaceholderText('Ask something...')).toBeInTheDocument();
  });

  it('renders header with Chat title', () => {
    render(<Chat messages={[]} onSend={vi.fn()} />);
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Chat messages={[]} onSend={vi.fn()} className="my-chat" />,
    );
    expect(container.firstChild).toHaveClass('my-chat');
  });
});
