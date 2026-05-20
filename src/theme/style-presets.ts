import type { BorderRadius, Spacing, Motion } from './types'

export interface StylePreset {
  id: string
  name: string
  description: string
  tags: string[]
  config: {
    borderRadius: BorderRadius
    flat: boolean
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
    config: { borderRadius: 'md', flat: false, spacing: 'normal', motion: 'snappy', animations: true },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Small rounded corners, flat design with compact spacing. Stripped down and clean.',
    tags: ['clean'],
    config: { borderRadius: 'sm', flat: true, spacing: 'compact', motion: 'smooth', animations: true },
  },
  bold: {
    id: 'bold',
    name: 'Bold',
    description: 'Full pill-shaped corners, rich shadows, generous spacing. High energy.',
    tags: ['playful'],
    config: { borderRadius: 'full', flat: false, spacing: 'spacious', motion: 'snappy', animations: true },
  },
  utilitarian: {
    id: 'utilitarian',
    name: 'Utilitarian',
    description: 'Sharp corners, flat, compact, no animations. Maximum information density.',
    tags: ['enterprise'],
    config: { borderRadius: 'none', flat: true, spacing: 'compact', motion: 'reduced', animations: false },
  },
  soft: {
    id: 'soft',
    name: 'Soft',
    description: 'Large rounded corners, gentle shadows, smooth animations. Relaxed and approachable.',
    tags: ['elegant'],
    config: { borderRadius: 'lg', flat: false, spacing: 'normal', motion: 'smooth', animations: true },
  },
  crisp: {
    id: 'crisp',
    name: 'Crisp',
    description: 'Medium rounded corners, flat, snappy motion. Fast and modern.',
    tags: ['modern'],
    config: { borderRadius: 'md', flat: true, spacing: 'normal', motion: 'snappy', animations: true },
  },
}

export const STYLE_PRESET_LIST: StylePreset[] = Object.values(STYLE_PRESETS)

export function getStylePreset(id: string): StylePreset | undefined {
  return STYLE_PRESETS[id]
}
