import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Accordion } from './Accordion';

const items = [
  { id: '1', title: 'Item 1', content: <p>Content 1</p> },
  { id: '2', title: 'Item 2', content: <p>Content 2</p> },
  { id: '3', title: 'Item 3', content: <p>Content 3</p> },
];

describe('Accordion', () => {
  it('renders all items with titles', () => {
    render(<Accordion items={items} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders item content when expanded', async () => {
    render(<Accordion items={items} />);
    const trigger = screen.getByRole('button', { name: /Item 1/ });
    await userEvent.click(trigger);
    const panel = document.getElementById(trigger.getAttribute('aria-controls')!);
    expect(panel).toHaveClass('contentOpen');
  });

  it('does not render item content when collapsed', () => {
    render(<Accordion items={items} />);
    const contentWrappers = document.querySelectorAll('[role="region"]');
    contentWrappers.forEach((wrapper) => {
      expect(wrapper).not.toHaveClass('contentOpen');
    });
  });

  it('toggles item on click', async () => {
    render(<Accordion items={items} />);
    const trigger = screen.getByText('Item 1');
    await userEvent.click(trigger);
    const panel = document.getElementById(
      trigger.closest('button')!.getAttribute('aria-controls')!,
    );
    expect(panel).toHaveClass('contentOpen');
    await userEvent.click(trigger);
    expect(panel).not.toHaveClass('contentOpen');
  });

  it('closes other items when new one opens', async () => {
    render(<Accordion items={items} />);
    const trigger1 = screen.getByText('Item 1').closest('button')!;
    const trigger2 = screen.getByText('Item 2').closest('button')!;
    await userEvent.click(trigger1);
    const panel1 = document.getElementById(trigger1.getAttribute('aria-controls')!);
    expect(panel1).toHaveClass('contentOpen');
    await userEvent.click(trigger2);
    expect(panel1).not.toHaveClass('contentOpen');
    const panel2 = document.getElementById(trigger2.getAttribute('aria-controls')!);
    expect(panel2).toHaveClass('contentOpen');
  });

  it('handles Enter key on trigger', async () => {
    render(<Accordion items={items} />);
    const trigger = screen.getByRole('button', { name: /Item 1/ });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const panel = document.getElementById(trigger.getAttribute('aria-controls')!);
    expect(panel).toHaveClass('contentOpen');
  });

  it('handles Space key on trigger', async () => {
    render(<Accordion items={items} />);
    const trigger = screen.getByRole('button', { name: /Item 1/ });
    trigger.focus();
    await userEvent.keyboard(' ');
    const panel = document.getElementById(trigger.getAttribute('aria-controls')!);
    expect(panel).toHaveClass('contentOpen');
  });

  it('handles disabled items', async () => {
    const disabledItems = [
      { id: '1', title: 'Item 1', content: <p>Content 1</p>, disabled: true },
      { id: '2', title: 'Item 2', content: <p>Content 2</p> },
    ];
    render(<Accordion items={disabledItems} />);
    const trigger = screen.getByRole('button', { name: /Item 1/ });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    const panel = document.getElementById(trigger.getAttribute('aria-controls')!);
    expect(panel).not.toHaveClass('contentOpen');
  });

  it('renders default variant', () => {
    render(<Accordion items={items} variant="default" />);
    const triggers = screen.getAllByRole('button');
    triggers.forEach((trigger) => {
      expect(trigger.closest('div')).toBeInTheDocument();
    });
  });

  it('renders bordered variant', () => {
    render(<Accordion items={items} variant="bordered" />);
    const triggers = screen.getAllByRole('button');
    triggers.forEach((trigger) => {
      expect(trigger.closest('div')).toBeInTheDocument();
    });
  });

  it('has proper aria-expanded attributes', async () => {
    render(<Accordion items={items} />);
    const triggers = screen.getAllByRole('button');
    triggers.forEach((trigger) => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
    await userEvent.click(triggers[0]);
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true');
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'false');
  });

  it('has aria-controls on triggers', () => {
    render(<Accordion items={items} />);
    const triggers = screen.getAllByRole('button');
    triggers.forEach((trigger) => {
      expect(trigger).toHaveAttribute('aria-controls');
    });
  });

  it('has region role on content panels', async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByText('Item 1'));
    const regions = screen.getAllByRole('region');
    expect(regions.length).toBeGreaterThanOrEqual(1);
  });

  it('calls onToggle when item is toggled', async () => {
    const onToggle = vi.fn();
    render(<Accordion items={items} onToggle={onToggle} />);
    await userEvent.click(screen.getByText('Item 1'));
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('opens default item when defaultOpen is set', () => {
    render(<Accordion items={items} defaultOpen="2" />);
    const trigger2 = screen.getByRole('button', { name: /Item 2/ });
    const panel2 = document.getElementById(trigger2.getAttribute('aria-controls')!);
    expect(panel2).toHaveClass('contentOpen');
  });

  it('applies custom className', () => {
    render(<Accordion items={items} className="my-accordion" />);
    const root = document.querySelector('[class*="root"]');
    expect(root).toHaveClass('my-accordion');
  });
});
