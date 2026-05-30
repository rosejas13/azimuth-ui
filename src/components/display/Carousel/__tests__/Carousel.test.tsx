import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Carousel } from '../Carousel';

describe('Carousel', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function renderSlides(n: number) {
    return Array.from({ length: n }, (_, i) => (
      <div key={i} data-testid={`slide-${i}`}>
        Slide {i + 1}
      </div>
    ));
  }

  it('renders slides', () => {
    render(<Carousel>{renderSlides(3)}</Carousel>);
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
  });

  it('shows navigation arrows', () => {
    render(<Carousel>{renderSlides(3)}</Carousel>);
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument();
  });

  it('hides arrows when showArrows is false', () => {
    render(
      <Carousel showArrows={false}>{renderSlides(3)}</Carousel>,
    );
    expect(screen.queryByRole('button', { name: 'Previous slide' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Next slide' })).toBeNull();
  });

  it('shows dot navigation', () => {
    render(<Carousel>{renderSlides(3)}</Carousel>);
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('hides dots when showDots is false', () => {
    render(
      <Carousel showDots={false}>{renderSlides(3)}</Carousel>,
    );
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  it('hides arrows and dots with single slide', () => {
    render(<Carousel>{renderSlides(1)}</Carousel>);
    expect(screen.queryByRole('button', { name: 'Previous slide' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Next slide' })).toBeNull();
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  it('marks active dot with aria-selected', () => {
    render(<Carousel>{renderSlides(3)}</Carousel>);
    const dots = screen.getAllByRole('tab');
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');
    expect(dots[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('navigates to next slide via arrow click', async () => {
    const user = userEvent.setup();
    render(<Carousel>{renderSlides(3)}</Carousel>);
    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    const dots = screen.getAllByRole('tab');
    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates to previous slide via arrow click', async () => {
    const user = userEvent.setup();
    render(<Carousel>{renderSlides(3)}</Carousel>);
    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    await user.click(screen.getByRole('button', { name: 'Previous slide' }));
    const dots = screen.getAllByRole('tab');
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates via dot click', async () => {
    const user = userEvent.setup();
    render(<Carousel>{renderSlides(4)}</Carousel>);
    const dots = screen.getAllByRole('tab');
    await user.click(dots[3]);
    expect(dots[3]).toHaveAttribute('aria-selected', 'true');
  });

  it('auto-plays when autoPlay is set', () => {
    render(<Carousel autoPlay interval={500}>{renderSlides(3)}</Carousel>);
    act(() => {
      vi.advanceTimersByTime(600);
    });
    const dots = screen.getAllByRole('tab');
    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('applies className', () => {
    render(
      <Carousel className="test-class">{renderSlides(3)}</Carousel>,
    );
    expect(screen.getByRole('tablist').parentElement).toHaveClass('test-class');
  });

  describe('keyboard navigation', () => {
    beforeEach(() => {
      vi.useRealTimers();
    });

    it('navigates to next slide on Next button click', async () => {
      const user = userEvent.setup();
      render(<Carousel>{renderSlides(3)}</Carousel>);
      await user.click(screen.getByLabelText('Next slide'));
      const dots = screen.getAllByRole('tab');
      expect(dots[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates to previous slide on Prev button click', async () => {
      const user = userEvent.setup();
      render(<Carousel>{renderSlides(3)}</Carousel>);
      await user.click(screen.getByLabelText('Next slide'));
      await user.click(screen.getByLabelText('Previous slide'));
      const dots = screen.getAllByRole('tab');
      expect(dots[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('wraps from first to last on Prev button click', async () => {
      const user = userEvent.setup();
      render(<Carousel>{renderSlides(3)}</Carousel>);
      await user.click(screen.getByLabelText('Previous slide'));
      const dots = screen.getAllByRole('tab');
      expect(dots[2]).toHaveAttribute('aria-selected', 'true');
    });

    it('wraps from last to first on Next button click', async () => {
      const user = userEvent.setup();
      render(<Carousel>{renderSlides(3)}</Carousel>);
      await user.click(screen.getByLabelText('Next slide'));
      await user.click(screen.getByLabelText('Next slide'));
      await user.click(screen.getByLabelText('Next slide'));
      const dots = screen.getAllByRole('tab');
      expect(dots[0]).toHaveAttribute('aria-selected', 'true');
    });
  });
});
