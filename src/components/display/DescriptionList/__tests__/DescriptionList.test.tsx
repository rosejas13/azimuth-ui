import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DescriptionList } from '../DescriptionList';

describe('DescriptionList', () => {
  it('renders dt/dd pairs from two Items', () => {
    render(
      <DescriptionList>
        <DescriptionList.Item term="Region">us-east-1</DescriptionList.Item>
        <DescriptionList.Item term="Plan">Pro</DescriptionList.Item>
      </DescriptionList>,
    );
    expect(screen.getAllByRole('term')).toHaveLength(2);
    expect(screen.getByText('us-east-1')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('makes terms queryable by text', () => {
    render(<DescriptionList.Item term="Memory">16 GB</DescriptionList.Item>);
    expect(screen.getByText('Memory').tagName).toBe('DT');
  });

  it('applies bordered class when bordered is true', () => {
    const { rerender } = render(
      <DescriptionList data-testid="dl">
        <DescriptionList.Item term="A">1</DescriptionList.Item>
      </DescriptionList>,
    );
    const dl = screen.getByTestId('dl');
    expect(dl.tagName).toBe('DL');
    rerender(
      <DescriptionList bordered data-testid="dl">
        <DescriptionList.Item term="A">1</DescriptionList.Item>
      </DescriptionList>,
    );
    expect(screen.getByTestId('dl')).toHaveClass('bordered');
  });

  it('exposes Item via the compound component with displayName', () => {
    expect(DescriptionList.Item).toBeDefined();
    expect(DescriptionList.Item.displayName).toBe('DescriptionList.Item');
  });

  it('spreads dd natives onto the description element', () => {
    render(
      <DescriptionList.Item term="ID" data-testid="dd">
        x-42
      </DescriptionList.Item>,
    );
    expect(screen.getByTestId('dd').tagName).toBe('DD');
  });
});
