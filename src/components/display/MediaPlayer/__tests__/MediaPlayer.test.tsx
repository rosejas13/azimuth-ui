import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MediaPlayer } from '../MediaPlayer';

describe('MediaPlayer', () => {
  it('renders video element when type is video', () => {
    const { container } = render(<MediaPlayer source={{ src: 'video.mp4' }} />);

    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
  });

  it('renders audio element when type is audio', () => {
    const { container } = render(<MediaPlayer source={{ src: 'audio.mp3', type: 'audio' }} />);

    const audio = container.querySelector('audio');
    expect(audio).toBeInTheDocument();
  });

  it('uses video as default type', () => {
    const { container } = render(<MediaPlayer source={{ src: 'video.mp4' }} />);

    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(container.querySelector('audio')).not.toBeInTheDocument();
  });

  it('shows title as aria-label when provided', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} title="My Video" />);

    expect(screen.getByRole('application')).toHaveAttribute(
      'aria-label',
      'My Video',
    );
  });

  it('shows default aria-label when no title', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} />);

    expect(screen.getByRole('application')).toHaveAttribute(
      'aria-label',
      'Media player',
    );
  });

  it('shows controls when controls is true', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} playback={{ controls: true }} />);

    expect(screen.getByLabelText('Media controls')).toBeInTheDocument();
  });

  it('does not show custom controls when controls is false', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} playback={{ controls: false }} />);

    expect(screen.queryByLabelText('Media controls')).not.toBeInTheDocument();
  });

  it('renders poster attribute when provided and type is video', () => {
    const { container } = render(
      <MediaPlayer source={{ src: 'video.mp4', poster: 'poster.jpg' }} />,
    );

    const video = container.querySelector('video');
    expect(video).toHaveAttribute('poster', 'poster.jpg');
  });

  it('does not set poster on audio element', () => {
    const { container } = render(
      <MediaPlayer source={{ src: 'audio.mp3', type: 'audio', poster: 'poster.jpg' }} />,
    );

    const audio = container.querySelector('audio');
    expect(audio?.getAttribute('poster')).toBeNull();
  });

  it('renders loading state initially', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} />);

    expect(screen.getByLabelText('Loading media')).toBeInTheDocument();
  });

  it('shows play button in controls', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} playback={{ controls: true }} />);

    expect(screen.getByLabelText('Play')).toBeInTheDocument();
  });

  it('shows seek bar in controls', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} playback={{ controls: true }} />);

    expect(screen.getByLabelText('Seek')).toBeInTheDocument();
  });

  it('shows volume slider in controls', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} playback={{ controls: true }} />);

    expect(screen.getByLabelText('Volume')).toBeInTheDocument();
  });

  it('shows mute button in controls', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} playback={{ controls: true }} />);

    expect(screen.getByLabelText('Mute')).toBeInTheDocument();
  });

  it('shows playback speed select in controls', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} playback={{ controls: true }} />);

    expect(screen.getByLabelText('Playback speed')).toBeInTheDocument();
  });

  it('shows fullscreen button when type is video', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} playback={{ controls: true }} />);

    expect(screen.getByLabelText('Fullscreen')).toBeInTheDocument();
  });

  it('does not show fullscreen button when type is audio', () => {
    render(<MediaPlayer source={{ src: 'audio.mp3', type: 'audio' }} playback={{ controls: true }} />);

    expect(screen.queryByLabelText('Fullscreen')).not.toBeInTheDocument();
  });

  it('applies width and height styles when provided', () => {
    const { container } = render(
      <MediaPlayer source={{ src: 'video.mp4' }} dimensions={{ width: '800px', height: '450px' }} />,
    );

    const root = container.firstChild as HTMLElement;
    expect(root.style.width).toBe('800px');
    expect(root.style.height).toBe('450px');
  });

  it('passes autoPlay to media element', () => {
    const { container } = render(
      <MediaPlayer source={{ src: 'video.mp4' }} playback={{ autoPlay: true }} />,
    );

    const video = container.querySelector('video');
    expect(video).toHaveAttribute('autoplay');
  });

  it('passes loop to media element', () => {
    const { container } = render(
      <MediaPlayer source={{ src: 'video.mp4' }} playback={{ loop: true }} />,
    );

    const video = container.querySelector('video');
    expect(video).toHaveAttribute('loop');
  });

  it('passes muted to media element', () => {
    const { container } = render(
      <MediaPlayer source={{ src: 'video.mp4' }} playback={{ muted: true }} />,
    );

    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.muted).toBe(true);
  });

  it('renders children content', () => {
    const { container } = render(
      <MediaPlayer source={{ src: 'video.mp4' }}>
        <source src="video.webm" type="video/webm" />
        <track kind="captions" src="captions.vtt" label="English" />
      </MediaPlayer>,
    );

    const video = container.querySelector('video');
    expect(video?.querySelector('source')).not.toBeNull();
    expect(video?.querySelector('track')).not.toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MediaPlayer source={{ src: 'video.mp4' }} className="custom-player" />,
    );

    expect(container.firstChild).toHaveClass('custom-player');
  });

  it('has role application', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} />);

    expect(screen.getByRole('application')).toBeInTheDocument();
  });

  it('is focusable via tabIndex', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} />);

    const el = screen.getByRole('application');
    expect(el).toHaveAttribute('tabindex', '0');
  });

  it('shows playback rate options with valid values', () => {
    render(<MediaPlayer source={{ src: 'video.mp4' }} playback={{ controls: true }} />);

    const select = screen.getByLabelText('Playback speed');
    const options = Array.from(select.querySelectorAll('option'));
    const rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

    expect(options).toHaveLength(rates.length);
    rates.forEach((rate) => {
      expect(screen.getByRole('option', { name: `${rate}x` })).toBeInTheDocument();
    });
  });
});
