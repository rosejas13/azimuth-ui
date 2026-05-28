import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SimpleChart } from '../SimpleChart';

const data = [
  { label: 'Apples', value: 30, color: '#ff0000' },
  { label: 'Bananas', value: 50, color: '#ffff00' },
  { label: 'Cherries', value: 20, color: '#ff00ff' },
];

describe('SimpleChart', () => {
  it('renders bar chart when type=bar', () => {
    render(<SimpleChart chart={{ type: 'bar', data }} />);
    expect(screen.getByLabelText('Bar chart')).toBeInTheDocument();
  });

  it('renders line chart when type=line', () => {
    render(<SimpleChart chart={{ type: 'line', data }} />);
    expect(screen.getByLabelText('Line chart')).toBeInTheDocument();
  });

  it('renders pie chart when type=pie', () => {
    render(<SimpleChart chart={{ type: 'pie', data }} />);
    expect(screen.getByLabelText('Pie chart')).toBeInTheDocument();
  });

  it('renders SVG with viewBox', () => {
    render(<SimpleChart chart={{ data }} />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox');
  });

  it('renders with correct width and height', () => {
    render(<SimpleChart chart={{ data }} dimensions={{ width: 500, height: 300 }} />);
    const svg = document.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 500 300');
  });

  it('renders legend when showLegend=true', () => {
    render(<SimpleChart chart={{ data }} display={{ showLegend: true }} />);
    const legendItems = screen.getAllByText(/Apples|Bananas|Cherries/);
    expect(legendItems.length).toBeGreaterThanOrEqual(3);
  });

  it('renders grid lines when showGrid=true', () => {
    render(<SimpleChart chart={{ type: 'bar', data }} display={{ showGrid: true }} />);
    const gridLines = document.querySelectorAll('[class*="gridLine"]');
    expect(gridLines.length).toBeGreaterThan(0);
  });

  it('renders axis labels when provided', () => {
    render(<SimpleChart chart={{ type: 'bar', data }} display={{ xLabel: 'Fruit', yLabel: 'Count' }} />);
    expect(screen.getByText('Fruit')).toBeInTheDocument();
    expect(screen.getByText('Count')).toBeInTheDocument();
  });

  it('renders correct number of data elements', () => {
    render(<SimpleChart chart={{ type: 'bar', data }} />);
    const bars = document.querySelectorAll('[class*="bar"]');
    expect(bars.length).toBe(3);
  });

  it('renders horizontal bar chart', () => {
    render(<SimpleChart chart={{ type: 'bar', data, horizontal: true }} />);
    expect(screen.getByLabelText('Horizontal Bar chart')).toBeInTheDocument();
  });
});
