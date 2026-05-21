import type { BorderRadius, Spacing, Motion, Elevation } from './types'

export interface StylePreset {
  id: string
  name: string
  description: string
  tags: string[]
  config: {
    borderRadius: BorderRadius
    flat: boolean
    elevation: Elevation
    spacing: Spacing
    motion: Motion
    animations: boolean
  }
}

export const STYLE_PRESETS: Record<string, StylePreset> = {
  balanced: {
    id: 'balanced',
    name: 'Balanced',
    description: 'Medium rounded corners, normal shadows and spacing. Works everywhere.',
    tags: ['general'],
    config: { borderRadius: 'md', flat: false, elevation: 'raised', spacing: 'normal', motion: 'snappy', animations: true },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Small rounded corners, flat design with compact spacing. Stripped down and clean.',
    tags: ['clean'],
    config: { borderRadius: 'sm', flat: true, elevation: 'flat', spacing: 'compact', motion: 'smooth', animations: true },
  },
  bold: {
    id: 'bold',
    name: 'Bold',
    description: 'Bold rounded corners, rich shadows, generous spacing. High energy.',
    tags: ['playful'],
    config: { borderRadius: 'full', flat: false, elevation: 'raised', spacing: 'spacious', motion: 'snappy', animations: true },
  },
  utilitarian: {
    id: 'utilitarian',
    name: 'Utilitarian',
    description: 'Sharp corners, flat, compact, no animations. Maximum information density.',
    tags: ['enterprise'],
    config: { borderRadius: 'none', flat: true, elevation: 'flat', spacing: 'compact', motion: 'reduced', animations: false },
  },
  soft: {
    id: 'soft',
    name: 'Soft',
    description: 'Large rounded corners, gentle shadows, smooth animations. Relaxed and approachable.',
    tags: ['elegant'],
    config: { borderRadius: 'lg', flat: false, elevation: 'raised', spacing: 'normal', motion: 'smooth', animations: true },
  },
  crisp: {
    id: 'crisp',
    name: 'Crisp',
    description: 'Medium rounded corners, flat, snappy motion. Fast and modern.',
    tags: ['modern'],
    config: { borderRadius: 'md', flat: true, elevation: 'flat', spacing: 'normal', motion: 'snappy', animations: true },
  },
  elevated: {
    id: 'elevated',
    name: 'Elevated',
    description: 'Medium-large corners, pronounced shadows with visible depth. Elements lift from the surface.',
    tags: ['modern', 'depth'],
    config: { borderRadius: 'lg', flat: false, elevation: 'floating', spacing: 'normal', motion: 'snappy', animations: true },
  },
  float: {
    id: 'float',
    name: 'Float',
    description: 'Soft corners, heavy shadows, airy spacing. Elements feel suspended above the surface.',
    tags: ['playful', 'airy'],
    config: { borderRadius: 'full', flat: false, elevation: 'floating', spacing: 'spacious', motion: 'smooth', animations: true },
  },
}

export const STYLE_PRESET_LIST: StylePreset[] = Object.values(STYLE_PRESETS)

export function getStylePreset(id: string): StylePreset | undefined {
  return STYLE_PRESETS[id]
}
