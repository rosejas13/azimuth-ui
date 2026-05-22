'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './MediaPlayer.module.css';

export interface MediaPlayerProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  src: string;
  /** @default 'video' */
  type?: 'video' | 'audio';
  poster?: string;
  width?: string;
  height?: string;
  /** @default true */
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  title?: string;
  children?: ReactNode;
}

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === Infinity) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const MediaPlayer = forwardRef<HTMLDivElement, MediaPlayerProps>(
  (
    {
      src,
      type = 'video',
      poster,
      width,
      height,
      controls = true,
      autoPlay = false,
      loop = false,
      muted = false,
      title,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const mediaRef = useRef<HTMLVideoElement & HTMLAudioElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);

    const showControls = useCallback(() => {
      setControlsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (playing) {
        hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
      }
    }, [playing]);

    useEffect(() => {
      const id = hideTimerRef.current;
      if (id !== null) clearTimeout(id);
    }, []);

    const togglePlay = useCallback(() => {
      const el = mediaRef.current;
      if (!el) return;
      if (el.paused) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    }, []);

    const handleTimeUpdate = useCallback(() => {
      const el = mediaRef.current;
      if (el) {
        setCurrentTime(el.currentTime);
      }
    }, []);

    const handleLoadedMetadata = useCallback(() => {
      const el = mediaRef.current;
      if (el) {
        setDuration(el.duration);
        setLoading(false);
      }
    }, []);

    const handleError = useCallback(() => {
      setError(true);
      setLoading(false);
    }, []);

    const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const el = mediaRef.current;
      if (el) {
        el.currentTime = Number(e.target.value);
        setCurrentTime(el.currentTime);
      }
    }, []);

    const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const el = mediaRef.current;
      if (el) {
        const v = Number(e.target.value);
        el.volume = v;
        setVolume(v);
      }
    }, []);

    const toggleFullscreen = useCallback(async () => {
      const el = containerRef.current;
      if (!el) return;
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        await el.requestFullscreen();
        setIsFullscreen(true);
      }
    }, []);

    const handleRateChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const el = mediaRef.current;
        if (el) {
          const rate = Number(e.target.value);
          el.playbackRate = rate;
          setPlaybackRate(rate);
        }
      },
      [],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === ' ' || e.key === 'Space') {
          e.preventDefault();
          togglePlay();
        }
      },
      [togglePlay],
    );

    const MediaTag = type === 'video' ? 'video' : 'audio';

    return (
      <div
        ref={ref}
        className={cn(styles.container, className)}
        style={{ width, height }}
        onMouseMove={showControls}
        onMouseEnter={showControls}
        onMouseLeave={() => playing && setControlsVisible(false)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="application"
        aria-label={title || 'Media player'}
        {...props}
      >
        <div ref={containerRef} className={styles.mediaWrapper}>
          <MediaTag
            ref={mediaRef}
            src={src}
            poster={type === 'video' ? poster : undefined}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            className={styles.media}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleError}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            controls={!controls}
            aria-label={title}
          >
            {children}
          </MediaTag>

          {loading && !error && (
            <div className={styles.loadingOverlay} aria-label="Loading media">
              <div className={styles.spinner} />
            </div>
          )}

          {error && (
            <div className={styles.errorOverlay} role="alert">
              <span className={styles.errorText}>Failed to load media</span>
            </div>
          )}

          {controls && !error && (
            <div
              className={cn(
                styles.controls,
                controlsVisible && styles.controlsVisible,
              )}
              aria-label="Media controls"
            >
              <button
                type="button"
                className={styles.controlButton}
                onClick={togglePlay}
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? '\u23F8' : '\u25B6'}
              </button>

              <span className={styles.timeDisplay}>
                {formatTime(currentTime)}
              </span>

              <input
                type="range"
                className={styles.seekBar}
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                aria-label="Seek"
                aria-valuenow={currentTime}
                aria-valuemin={0}
                aria-valuemax={duration}
              />

              <span className={styles.timeDisplay}>
                {formatTime(duration)}
              </span>

              <span className={styles.volumeGroup}>
                <button
                  type="button"
                  className={styles.controlButton}
                  onClick={() => {
                    const el = mediaRef.current;
                    if (el) {
                      el.muted = !el.muted;
                      setVolume(el.muted ? 0 : 1);
                    }
                  }}
                  aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                >
                  {volume === 0 ? '\u{1F507}' : '\u{1F50A}'}
                </button>
                <input
                  type="range"
                  className={styles.volumeSlider}
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={handleVolume}
                  aria-label="Volume"
                />
              </span>

              <select
                className={styles.speedSelect}
                value={playbackRate}
                onChange={handleRateChange}
                aria-label="Playback speed"
              >
                {PLAYBACK_RATES.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}x
                  </option>
                ))}
              </select>

              {type === 'video' && (
                <button
                  type="button"
                  className={styles.controlButton}
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? '\u{1F5D5}' : '\u26F6'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

MediaPlayer.displayName = 'MediaPlayer';
