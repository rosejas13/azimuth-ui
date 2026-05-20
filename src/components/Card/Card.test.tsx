import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Body content</Card>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders header prop', () => {
    render(<Card header="Card Title">Body</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('renders footer prop', () => {
    render(<Card footer="Footer text">Body</Card>);
    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });

  it('renders expandable toggle with correct aria attributes when expandable', () => {
    render(<Card expandable>Content</Card>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders expandable toggle and collapses body on click', async () => {
    const user = userEvent.setup();
    render(<Card expandable defaultExpanded={true}>Collapsible content</Card>);
    const button = screen.getByRole('button');
    expect(screen.getByText('Collapsible content')).toBeInTheDocument();
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('render collapsed state when defaultExpanded is false', () => {
    render(
      <Card expandable defaultExpanded={false}>
        Hidden content
      </Card>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggle button has aria-controls pointing to body', () => {
    render(<Card expandable>Content</Card>);
    const button = screen.getByRole('button');
    const bodyId = button.getAttribute('aria-controls');
    expect(bodyId).toBeTruthy();
    const body = document.getElementById(bodyId!);
    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent('Content');
  });

  it('applies custom className', () => {
    render(<Card className="my-card">Content</Card>);
    const card = document.querySelector('.my-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('my-card');
  });

  it('renders Card.Header sub-component', () => {
    render(
      <Card>
        <Card.Header>Header content</Card.Header>
      </Card>,
    );
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('renders Card.Footer sub-component', () => {
    render(
      <Card>
        <Card.Footer>Footer content</Card.Footer>
      </Card>,
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('renders header, children, and footer together', () => {
    render(
      <Card header="Title" footer="Foot">
        Body text
      </Card>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
    expect(screen.getByText('Foot')).toBeInTheDocument();
  });
});
