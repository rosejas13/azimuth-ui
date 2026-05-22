import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SimpleChart } from './SimpleChart';

const data = [
  { label: 'Apples', value: 30, color: '#ff0000' },
  { label: 'Bananas', value: 50, color: '#ffff00' },
  { label: 'Cherries', value: 20, color: '#ff00ff' },
];

describe('SimpleChart', () => {
  it('renders bar chart when type=bar', () => {
    render(<SimpleChart type="bar" data={data} />);
    expect(screen.getByLabelText('Bar chart')).toBeInTheDocument();
  });

  it('renders line chart when type=line', () => {
    render(<SimpleChart type="line" data={data} />);
    expect(screen.getByLabelText('Line chart')).toBeInTheDocument();
  });

  it('renders pie chart when type=pie', () => {
    render(<SimpleChart type="pie" data={data} />);
    expect(screen.getByLabelText('Pie chart')).toBeInTheDocument();
  });

  it('renders SVG with viewBox', () => {
    render(<SimpleChart data={data} />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox');
  });

  it('renders with correct width and height', () => {
    render(<SimpleChart data={data} width={500} height={300} />);
    const svg = document.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 500 300');
  });

  it('renders legend when showLegend=true', () => {
    render(<SimpleChart data={data} showLegend />);
    const legendItems = screen.getAllByText(/Apples|Bananas|Cherries/);
    expect(legendItems.length).toBeGreaterThanOrEqual(3);
  });

  it('renders grid lines when showGrid=true', () => {
    render(<SimpleChart type="bar" data={data} showGrid />);
    const gridLines = document.querySelectorAll('[class*="gridLine"]');
    expect(gridLines.length).toBeGreaterThan(0);
  });

  it('renders axis labels when provided', () => {
    render(<SimpleChart type="bar" data={data} xLabel="Fruit" yLabel="Count" />);
    expect(screen.getByText('Fruit')).toBeInTheDocument();
    expect(screen.getByText('Count')).toBeInTheDocument();
  });

  it('renders correct number of data elements', () => {
    render(<SimpleChart type="bar" data={data} />);
    const bars = document.querySelectorAll('[class*="bar"]');
    expect(bars.length).toBe(3);
  });

  it('renders horizontal bar chart', () => {
    render(<SimpleChart type="bar" data={data} horizontal />);
    expect(screen.getByLabelText('Horizontal Bar chart')).toBeInTheDocument();
  });
});
