import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ImageViewer } from './ImageViewer';

const twoImages = [
  { src: 'image1.jpg', alt: 'Image 1', caption: 'First image caption' },
  { src: 'image2.jpg', alt: 'Image 2', caption: 'Second image caption' },
];

const singleImage = [
  { src: 'solo.jpg', alt: 'Solo image' },
];

describe('ImageViewer', () => {
  it('renders when open=true', () => {
    render(<ImageViewer images={singleImage} open onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when open=false', () => {
    render(<ImageViewer images={singleImage} open={false} onClose={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not render when open=true but images array is empty', () => {
    render(<ImageViewer images={[]} open onClose={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows image at current index', () => {
    render(<ImageViewer images={twoImages} open onClose={vi.fn()} />);

    const img = screen.getByRole('img', { name: 'Image 1' });
    expect(img).toHaveAttribute('src', 'image1.jpg');
  });

  it('navigates to next image', async () => {
    const user = userEvent.setup();
    render(<ImageViewer images={twoImages} open onClose={vi.fn()} />);

    await user.click(screen.getByLabelText('Next image'));

    const img = screen.getByRole('img', { name: 'Image 2' });
    expect(img).toHaveAttribute('src', 'image2.jpg');
  });

  it('navigates to previous image', async () => {
    const user = userEvent.setup();
    render(
      <ImageViewer images={twoImages} open onClose={vi.fn()} initialIndex={1} />,
    );

    await user.click(screen.getByLabelText('Previous image'));

    const img = screen.getByRole('img', { name: 'Image 1' });
    expect(img).toHaveAttribute('src', 'image1.jpg');
  });

  it('shows close button', () => {
    render(<ImageViewer images={singleImage} open onClose={vi.fn()} />);

    expect(screen.getByLabelText('Close viewer')).toBeInTheDocument();
  });

  it('fires onClose when X clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ImageViewer images={singleImage} open onClose={onClose} />);

    await user.click(screen.getByLabelText('Close viewer'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('fires onClose on Escape key', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ImageViewer images={singleImage} open onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows caption when showCaption is true and caption exists', () => {
    render(
      <ImageViewer images={twoImages} open onClose={vi.fn()} showCaption />,
    );

    expect(screen.getByText('First image caption')).toBeInTheDocument();
  });

  it('does not show caption slot when showCaption is false', () => {
    render(
      <ImageViewer
        images={twoImages}
        open
        onClose={vi.fn()}
        showCaption={false}
      />,
    );

    expect(screen.queryByText('First image caption')).not.toBeInTheDocument();
  });

  it('shows counter text', () => {
    render(<ImageViewer images={twoImages} open onClose={vi.fn()} />);

    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('updates counter after navigation', async () => {
    const user = userEvent.setup();
    render(<ImageViewer images={twoImages} open onClose={vi.fn()} />);

    expect(screen.getByText('1 / 2')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Next image'));

    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });

  it('handles initialIndex prop', () => {
    render(
      <ImageViewer images={twoImages} open onClose={vi.fn()} initialIndex={1} />,
    );

    const img = screen.getByRole('img', { name: 'Image 2' });
    expect(img).toHaveAttribute('src', 'image2.jpg');
  });

  it('shows counter with initialIndex', () => {
    render(
      <ImageViewer images={twoImages} open onClose={vi.fn()} initialIndex={1} />,
    );

    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });

  it('does not show navigation buttons for single image', () => {
    render(<ImageViewer images={singleImage} open onClose={vi.fn()} />);

    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
  });

  it('wraps next from last image to first', async () => {
    const user = userEvent.setup();
    render(
      <ImageViewer images={twoImages} open onClose={vi.fn()} initialIndex={1} />,
    );

    await user.click(screen.getByLabelText('Next image'));

    const img = screen.getByRole('img', { name: 'Image 1' });
    expect(img).toHaveAttribute('src', 'image1.jpg');
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('wraps previous from first image to last', async () => {
    const user = userEvent.setup();
    render(<ImageViewer images={twoImages} open onClose={vi.fn()} />);

    await user.click(screen.getByLabelText('Previous image'));

    const img = screen.getByRole('img', { name: 'Image 2' });
    expect(img).toHaveAttribute('src', 'image2.jpg');
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });

  it('navigates with ArrowRight key', async () => {
    const user = userEvent.setup();
    render(<ImageViewer images={twoImages} open onClose={vi.fn()} />);

    await user.keyboard('{ArrowRight}');

    const img = screen.getByRole('img', { name: 'Image 2' });
    expect(img).toHaveAttribute('src', 'image2.jpg');
  });

  it('navigates with ArrowLeft key', async () => {
    const user = userEvent.setup();
    render(
      <ImageViewer images={twoImages} open onClose={vi.fn()} initialIndex={1} />,
    );

    await user.keyboard('{ArrowLeft}');

    const img = screen.getByRole('img', { name: 'Image 1' });
    expect(img).toHaveAttribute('src', 'image1.jpg');
  });

  it('closes on overlay click', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ImageViewer images={singleImage} open onClose={onClose} />);

    await user.click(screen.getByRole('dialog'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has aria-modal true', () => {
    render(<ImageViewer images={singleImage} open onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('shows loading skeleton initially', () => {
    render(<ImageViewer images={singleImage} open onClose={vi.fn()} />);

    const spinner = document.querySelector('[class*="spinner"]');
    expect(spinner).not.toBeNull();
  });
});
