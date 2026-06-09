import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ProgressSteps, type Step } from '../ProgressSteps';

const defaultSteps: Step[] = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Set up your profile' },
  { title: 'Billing', description: 'Configure billing' },
  { title: 'Done', description: 'All set' },
];

describe('ProgressSteps', () => {
  it('renders all steps', () => {
    render(<ProgressSteps steps={defaultSteps} currentStep={1} />);
    for (const step of defaultSteps) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    }
  });

  it('sets aria-current on the active step', () => {
    render(<ProgressSteps steps={defaultSteps} currentStep={2} />);
    const items = screen.getAllByRole('listitem');
    expect(items[2]).toHaveAttribute('aria-current', 'step');
  });

  it('sets aria-label on completed steps', () => {
    render(<ProgressSteps steps={defaultSteps} currentStep={2} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveAttribute('aria-label', 'Step 1: completed');
    expect(items[1]).toHaveAttribute('aria-label', 'Step 2: completed');
    expect(items[2]).not.toHaveAttribute('aria-label');
    expect(items[3]).not.toHaveAttribute('aria-label');
  });

  it('has list role with Progress label', () => {
    render(<ProgressSteps steps={defaultSteps} currentStep={0} />);
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-label', 'Progress');
  });

  it('calls onStepClick when a completed step is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <ProgressSteps
        steps={defaultSteps}
        currentStep={3}
        onStepClick={handleClick}
      />,
    );
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(handleClick).toHaveBeenCalledWith(0);
  });

  it('does not render buttons for the current step', () => {
    render(
      <ProgressSteps
        steps={defaultSteps}
        currentStep={1}
        onStepClick={() => {}}
      />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
  });

  it('renders checkmark on completed steps in default variant', () => {
    render(<ProgressSteps steps={defaultSteps} currentStep={2} />);
    const indicators = document.querySelectorAll('[class*="indicator"]');
    expect(indicators[0].textContent).toBe('✓');
    expect(indicators[1].textContent).toBe('✓');
    expect(indicators[2].textContent).not.toBe('✓');
    expect(indicators[3].textContent).not.toBe('✓');
  });

  it('renders numbers on all steps in numbered variant', () => {
    render(
      <ProgressSteps steps={defaultSteps} currentStep={2} variant="numbered" />,
    );
    const indicators = document.querySelectorAll('[class*="indicator"]');
    expect(indicators[0].textContent).toBe('1');
    expect(indicators[1].textContent).toBe('2');
    expect(indicators[2].textContent).toBe('3');
    expect(indicators[3].textContent).toBe('4');
  });

  it('applies compact class', () => {
    const { container } = render(
      <ProgressSteps steps={defaultSteps} currentStep={0} variant="compact" />,
    );
    expect(container.firstChild).toHaveClass('compact');
  });

  it('renders custom icon when provided', () => {
    const stepsWithIcon: Step[] = [
      { title: 'Step 1', icon: <span data-testid="custom-icon">★</span> },
      { title: 'Step 2' },
    ];
    render(<ProgressSteps steps={stepsWithIcon} currentStep={1} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ProgressSteps
        steps={defaultSteps}
        currentStep={0}
        className="my-class"
      />,
    );
    expect(container.firstChild).toHaveClass('my-class');
  });

  it('applies vertical orientation class', () => {
    const { container } = render(
      <ProgressSteps
        steps={defaultSteps}
        currentStep={0}
        orientation="vertical"
      />,
    );
    expect(container.firstChild).toHaveClass('vertical');
  });

  it('does not render description in compact variant', () => {
    render(
      <ProgressSteps steps={defaultSteps} currentStep={0} variant="compact" />,
    );
    expect(screen.queryByText('Create your account')).not.toBeInTheDocument();
    expect(screen.queryByText('Set up your profile')).not.toBeInTheDocument();
  });
});
