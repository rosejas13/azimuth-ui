import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorPage } from './ErrorPage';

describe('ErrorPage', () => {
  it('renders status code', () => {
    render(<ErrorPage status={404} />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<ErrorPage title="Not Found" />);
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<ErrorPage description="The page you are looking for does not exist." />);
    expect(screen.getByText('The page you are looking for does not exist.')).toBeInTheDocument();
  });

  it('renders action', () => {
    render(<ErrorPage action={<button>Go Home</button>} />);
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<ErrorPage icon={<span data-testid="error-icon">!</span>} />);
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });

  it('renders size sm variant', () => {
    render(<ErrorPage size="sm" />);
    expect(screen.getByRole('alert')).toHaveClass('sm');
  });

  it('renders size md variant', () => {
    render(<ErrorPage size="md" />);
    expect(screen.getByRole('alert')).toHaveClass('md');
  });

  it('renders size lg variant', () => {
    render(<ErrorPage size="lg" />);
    expect(screen.getByRole('alert')).toHaveClass('lg');
  });

  it('renders default status code 404', () => {
    render(<ErrorPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders default title for status 500', () => {
    render(<ErrorPage status={500} />);
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('renders with custom status code', () => {
    render(<ErrorPage status={403} title="Forbidden" />);
    expect(screen.getByText('403')).toBeInTheDocument();
    expect(screen.getByText('Forbidden')).toBeInTheDocument();
  });

  it('has alert role', () => {
    render(<ErrorPage />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ErrorPage className="my-error" />);
    expect(screen.getByRole('alert')).toHaveClass('my-error');
  });
});
