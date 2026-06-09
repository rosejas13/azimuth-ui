import type { BorderRadius, Spacing, Motion, Elevation } from './types';

/** A named style preset that defines border radius, elevation, spacing, and motion for a consistent visual rhythm. */
export interface StylePreset {
  /** Unique identifier for the preset. */
  id: string;
  /** Human-readable display name. */
  name: string;
  /** Short description of the preset's character and use case. */
  description: string;
  /** Categorization tags for filtering and discovery. */
  tags: string[];
  /** The theme configuration values this preset overrides. */
  config: {
    borderRadius: BorderRadius;
    flat: boolean;
    elevation: Elevation;
    spacing: Spacing;
    motion: Motion;
    animations: boolean;
  };
}

/** Registry of all built-in style presets, keyed by preset id. */
export const STYLE_PRESETS: Record<string, StylePreset> = {
  balanced: {
    id: 'balanced',
    name: 'Balanced',
    description:
      'Medium rounded corners, normal shadows and spacing. Works everywhere.',
    tags: ['general'],
    config: {
      borderRadius: 'md',
      flat: false,
      elevation: 'raised',
      spacing: 'normal',
      motion: 'snappy',
      animations: true,
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description:
      'Small rounded corners, flat design with compact spacing. Stripped down and clean.',
    tags: ['clean'],
    config: {
      borderRadius: 'sm',
      flat: true,
      elevation: 'flat',
      spacing: 'compact',
      motion: 'smooth',
      animations: true,
    },
  },
  bold: {
    id: 'bold',
    name: 'Bold',
    description:
      'Bold rounded corners, rich shadows, generous spacing. High energy.',
    tags: ['playful'],
    config: {
      borderRadius: 'full',
      flat: false,
      elevation: 'raised',
      spacing: 'spacious',
      motion: 'snappy',
      animations: true,
    },
  },
  utilitarian: {
    id: 'utilitarian',
    name: 'Utilitarian',
    description:
      'Sharp corners, flat, compact, no animations. Maximum information density.',
    tags: ['enterprise'],
    config: {
      borderRadius: 'none',
      flat: true,
      elevation: 'flat',
      spacing: 'compact',
      motion: 'reduced',
      animations: false,
    },
  },
  soft: {
    id: 'soft',
    name: 'Soft',
    description:
      'Large rounded corners, gentle shadows, smooth animations. Relaxed and approachable.',
    tags: ['elegant'],
    config: {
      borderRadius: 'lg',
      flat: false,
      elevation: 'raised',
      spacing: 'normal',
      motion: 'smooth',
      animations: true,
    },
  },
  crisp: {
    id: 'crisp',
    name: 'Crisp',
    description:
      'Medium rounded corners, flat, snappy motion. Fast and modern.',
    tags: ['modern'],
    config: {
      borderRadius: 'md',
      flat: true,
      elevation: 'flat',
      spacing: 'normal',
      motion: 'snappy',
      animations: true,
    },
  },
  elevated: {
    id: 'elevated',
    name: 'Elevated',
    description:
      'Medium-large corners, pronounced shadows with visible depth. Elements lift from the surface.',
    tags: ['modern', 'depth'],
    config: {
      borderRadius: 'lg',
      flat: false,
      elevation: 'floating',
      spacing: 'normal',
      motion: 'snappy',
      animations: true,
    },
  },
  float: {
    id: 'float',
    name: 'Float',
    description:
      'Soft corners, heavy shadows, airy spacing. Elements feel suspended above the surface.',
    tags: ['playful', 'airy'],
    config: {
      borderRadius: 'full',
      flat: false,
      elevation: 'floating',
      spacing: 'spacious',
      motion: 'smooth',
      animations: true,
    },
  },
};

/** Flat array of all built-in style presets. Convenient for mapping over in UI pickers. */
export const STYLE_PRESET_LIST: StylePreset[] = Object.values(STYLE_PRESETS);

/**
 * Looks up a style preset by its id.
 *
 * @param id - The preset id to find.
 * @returns The matching StylePreset, or undefined if not found.
 */
export function getStylePreset(id: string): StylePreset | undefined {
  return STYLE_PRESETS[id];
}
