import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Card } from '../Card';

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
    render(
      <Card expandable defaultExpanded={true}>
        Collapsible content
      </Card>,
    );
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

  it('renders with elevated variant class', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    expect(container.firstChild).toHaveClass('elevated');
  });

  it('renders with dashed variant class', () => {
    const { container } = render(<Card variant="dashed">Content</Card>);
    expect(container.firstChild).toHaveClass('dashed');
  });

  it('renders with fill class', () => {
    const { container } = render(<Card fill>Content</Card>);
    expect(container.firstChild).toHaveClass('fill');
  });

  it('default variant (outline) does not apply variant class', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).not.toHaveClass('outline');
    expect(container.firstChild).not.toHaveClass('elevated');
    expect(container.firstChild).not.toHaveClass('dashed');
  });
});

describe('CSS structure', () => {
  it('applies the card CSS module class to the root element', () => {
    const { container } = render(<Card>Content</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInstanceOf(HTMLDivElement);
    expect(el.classList.length).toBeGreaterThan(0);
    expect(el.className).toContain('card');
  });

  it('applies elevated and dashed variant CSS module classes', () => {
    const { container: elevated } = render(
      <Card variant="elevated">Content</Card>,
    );
    expect((elevated.firstChild as HTMLElement).className).toContain(
      'elevated',
    );

    const { container: dashed } = render(<Card variant="dashed">Content</Card>);
    expect((dashed.firstChild as HTMLElement).className).toContain('dashed');
  });

  it('applies the fill CSS module class', () => {
    const { container } = render(<Card fill>Content</Card>);
    expect((container.firstChild as HTMLElement).className).toContain('fill');
  });

  it('applies header, body, and footer CSS module classes to sub-elements', () => {
    const { container } = render(
      <Card header="Title" footer="Foot">
        Body
      </Card>,
    );
    const bodyEl = container.querySelector('.body');
    expect(bodyEl).toBeTruthy();
    expect(bodyEl?.textContent).toContain('Body');

    const headerEl = container.querySelector('.header');
    expect(headerEl).toBeTruthy();
    expect(headerEl?.textContent).toContain('Title');

    const footerEl = container.querySelector('.footer');
    expect(footerEl).toBeTruthy();
    expect(footerEl?.textContent).toContain('Foot');
  });

  it('applies collapsed CSS module class to body when defaultExpanded is false', () => {
    const { container } = render(
      <Card expandable defaultExpanded={false}>
        Hidden
      </Card>,
    );
    const body = container.querySelector('.body');
    expect(body?.className).toContain('collapsed');
  });

  it('does not apply collapsed CSS module class when defaultExpanded is true', () => {
    const { container } = render(
      <Card expandable defaultExpanded={true}>
        Visible
      </Card>,
    );
    const body = container.querySelector('.body');
    expect(body?.className).not.toContain('collapsed');
  });
});

describe('Card title prop and collapsed visibility', () => {
  it('renders title as a styled heading in the header row', () => {
    render(<Card title="Project Alpha">Body</Card>);
    const heading = screen.getByRole('heading', { name: 'Project Alpha' });
    expect(heading.tagName).toBe('H3');
  });

  it('header node takes precedence over title when both are set', () => {
    render(
      <Card title="Ignored" header={<span>Custom Header</span>}>
        Body
      </Card>,
    );
    expect(screen.getByText('Custom Header')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('title coexists with the expandable toggle', async () => {
    const user = userEvent.setup();
    render(
      <Card title="Collapsible" expandable defaultExpanded>
        Content
      </Card>,
    );
    expect(
      screen.getByRole('heading', { name: 'Collapsible' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('collapsed body is aria-hidden; expanded body is not', async () => {
    const user = userEvent.setup();
    render(
      <Card expandable defaultExpanded={false}>
        Hidden
      </Card>,
    );
    const button = screen.getByRole('button');
    const body = document.getElementById(button.getAttribute('aria-controls')!);
    expect(body).toHaveAttribute('aria-hidden', 'true');
    await user.click(button);
    expect(body).not.toHaveAttribute('aria-hidden');
  });
});
