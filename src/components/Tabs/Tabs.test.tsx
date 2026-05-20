import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Tabs } from './Tabs';

const sampleTabs = [
  { id: 'tab1', label: 'Tab 1', content: <p>Content 1</p> },
  { id: 'tab2', label: 'Tab 2', content: <p>Content 2</p> },
  { id: 'tab3', label: 'Tab 3', content: <p>Content 3</p> },
];

describe('Tabs', () => {
  it('renders tablist with correct role', () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('renders all tab buttons with tab role', () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument();
  });

  it('renders tabpanel with correct role', () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('shows content for the active tab', () => {
    render(<Tabs tabs={sampleTabs} defaultTab="tab1" />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).toBeNull();
  });

  it('marks active tab with aria-selected', () => {
    render(<Tabs tabs={sampleTabs} defaultTab="tab2" />);
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

    expect(tab1).toHaveAttribute('aria-selected', 'false');
    expect(tab2).toHaveAttribute('aria-selected', 'true');
  });

  it('links tab to panel with aria-controls', () => {
    render(<Tabs tabs={sampleTabs} />);
    const tab = screen.getByRole('tab', { name: 'Tab 1' });
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  });

  it('switches tab on click', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} defaultTab="tab1" />);

    expect(screen.getByText('Content 1')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).toBeNull();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('switches tab with ArrowRight key', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} defaultTab="tab1" />);

    screen.getByRole('tab', { name: 'Tab 1' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('switches tab with ArrowLeft key', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} defaultTab="tab3" />);

    screen.getByRole('tab', { name: 'Tab 3' }).focus();
    await user.keyboard('{ArrowLeft}');

    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('wraps ArrowLeft to last tab', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} defaultTab="tab1" />);

    screen.getByRole('tab', { name: 'Tab 1' }).focus();
    await user.keyboard('{ArrowLeft}');

    expect(screen.getByText('Content 3')).toBeInTheDocument();
  });

  it('wraps ArrowRight to first tab', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} defaultTab="tab3" />);

    screen.getByRole('tab', { name: 'Tab 3' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('supports Home key for first tab', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} defaultTab="tab3" />);

    screen.getByRole('tab', { name: 'Tab 3' }).focus();
    await user.keyboard('{Home}');

    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('supports End key for last tab', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} defaultTab="tab1" />);

    screen.getByRole('tab', { name: 'Tab 1' }).focus();
    await user.keyboard('{End}');

    expect(screen.getByText('Content 3')).toBeInTheDocument();
  });

  it('calls onChange when tab switches', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} defaultTab="tab1" onChange={handleChange} />);

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });

  it('works in controlled mode', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Tabs tabs={sampleTabs} activeTab="tab1" onChange={() => {}} />,
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    rerender(
      <Tabs tabs={sampleTabs} activeTab="tab2" onChange={() => {}} />,
    );
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('does not switch to disabled tab', async () => {
    const tabs = [
      { id: 'tab1', label: 'Tab 1', content: <p>Content 1</p> },
      { id: 'tab2', label: 'Tab 2', content: <p>Content 2</p>, disabled: true },
      { id: 'tab3', label: 'Tab 3', content: <p>Content 3</p> },
    ];
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} defaultTab="tab1" />);

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('skips disabled tabs in keyboard navigation', async () => {
    const tabs = [
      { id: 'tab1', label: 'Tab 1', content: <p>Content 1</p> },
      { id: 'tab2', label: 'Tab 2', content: <p>Content 2</p>, disabled: true },
      { id: 'tab3', label: 'Tab 3', content: <p>Content 3</p> },
    ];
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} defaultTab="tab1" />);

    screen.getByRole('tab', { name: 'Tab 1' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByText('Content 3')).toBeInTheDocument();
  });

  it('renders disabled tab with disabled attribute', () => {
    const tabs = [
      { id: 'tab1', label: 'Tab 1', content: <p>Content 1</p> },
      { id: 'tab2', label: 'Tab 2', content: <p>Content 2</p>, disabled: true },
    ];

    render(<Tabs tabs={tabs} />);
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Tabs tabs={sampleTabs} className="custom-tabs" />);
    expect(screen.getByRole('tablist').parentElement).toHaveClass('custom-tabs');
  });

  it('renders underline variant by default', () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByRole('tablist').parentElement).toHaveClass('underline');
  });

  it('renders pills variant', () => {
    render(<Tabs tabs={sampleTabs} variant="pills" />);
    expect(screen.getByRole('tablist').parentElement).toHaveClass('pills');
  });

  it('renders buttons variant', () => {
    render(<Tabs tabs={sampleTabs} variant="buttons" />);
    expect(screen.getByRole('tablist').parentElement).toHaveClass('buttons');
  });

  it('handles single tab', () => {
    render(<Tabs tabs={[{ id: 'only', label: 'Only', content: <p>Only Content</p> }]} />);
    expect(screen.getByRole('tab', { name: 'Only' })).toBeInTheDocument();
    expect(screen.getByText('Only Content')).toBeInTheDocument();
  });

  it('defaults to first enabled tab', () => {
    const tabs = [
      { id: 'tab1', label: 'Tab 1', content: <p>Content 1</p>, disabled: true },
      { id: 'tab2', label: 'Tab 2', content: <p>Content 2</p> },
    ];

    render(<Tabs tabs={tabs} />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});
