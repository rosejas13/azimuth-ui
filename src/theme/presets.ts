import type { ThemeConfig } from './types'

export interface ThemePreset {
  id: string
  name: string
  description: string
  tags: string[]
  config: Required<ThemeConfig>
}

const ocean: ThemePreset = {
  id: 'ocean',
  name: 'Ocean',
  description: 'Crisp, balanced feel with teal primary and coral accent. Good for SaaS and portfolios.',
  tags: ['light', 'modern', 'professional'],
  config: {
    accentColor: '#e8734a',
    borderRadius: 'md',
    flat: false,
    spacing: 'normal',
    animations: true,
    motion: 'snappy',
    mode: 'system',
    fontDisplay: 'Sora, system-ui, sans-serif',
    fontBody: 'Onest, system-ui, sans-serif',
  },
}

const minimal: ThemePreset = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Stripped-down, flat design with compact spacing. No shadows, subtle interactions.',
  tags: ['light', 'minimal', 'clean'],
  config: {
    accentColor: '#6b7280',
    borderRadius: 'sm',
    flat: true,
    spacing: 'compact',
    animations: true,
    motion: 'smooth',
    mode: 'system',
    fontDisplay: 'Sora, system-ui, sans-serif',
    fontBody: 'Onest, system-ui, sans-serif',
  },
}

const bold: ThemePreset = {
  id: 'bold',
  name: 'Bold',
  description: 'Full rounded corners, generous spacing, rich shadows. High-energy, playful feel.',
  tags: ['light', 'bold', 'playful'],
  config: {
    accentColor: '#8b5cf6',
    borderRadius: 'full',
    flat: false,
    spacing: 'spacious',
    animations: true,
    motion: 'snappy',
    mode: 'system',
    fontDisplay: 'Sora, system-ui, sans-serif',
    fontBody: 'Onest, system-ui, sans-serif',
  },
}

const midnight: ThemePreset = {
  id: 'midnight',
  name: 'Midnight',
  description: 'Dark-mode first with indigo accent. Professional and easy on the eyes.',
  tags: ['dark', 'modern', 'professional'],
  config: {
    accentColor: '#818cf8',
    borderRadius: 'lg',
    flat: false,
    spacing: 'normal',
    animations: true,
    motion: 'smooth',
    mode: 'dark',
    fontDisplay: 'Sora, system-ui, sans-serif',
    fontBody: 'Onest, system-ui, sans-serif',
  },
}

const forest: ThemePreset = {
  id: 'forest',
  name: 'Forest',
  description: 'Earthy green tones with smooth motion. Calm, natural, grounded feel.',
  tags: ['light', 'natural', 'calm'],
  config: {
    accentColor: '#34d399',
    borderRadius: 'md',
    flat: false,
    spacing: 'normal',
    animations: true,
    motion: 'smooth',
    mode: 'system',
    fontDisplay: 'Sora, system-ui, sans-serif',
    fontBody: 'Onest, system-ui, sans-serif',
  },
}

const sunset: ThemePreset = {
  id: 'sunset',
  name: 'Sunset',
  description: 'Warm orange tones, soft rounded corners. Creative, inviting warmth.',
  tags: ['light', 'warm', 'creative'],
  config: {
    accentColor: '#f97316',
    borderRadius: 'lg',
    flat: false,
    spacing: 'spacious',
    animations: true,
    motion: 'snappy',
    mode: 'light',
    fontDisplay: 'Sora, system-ui, sans-serif',
    fontBody: 'Onest, system-ui, sans-serif',
  },
}

const slate: ThemePreset = {
  id: 'slate',
  name: 'Slate',
  description: 'Sharp corners, no shadows, no animations. Enterprise dashboard feel.',
  tags: ['light', 'enterprise', 'utilitarian'],
  config: {
    accentColor: '#64748b',
    borderRadius: 'none',
    flat: true,
    spacing: 'compact',
    animations: false,
    motion: 'reduced',
    mode: 'system',
    fontDisplay: 'Sora, system-ui, sans-serif',
    fontBody: 'Onest, system-ui, sans-serif',
  },
}

const rose: ThemePreset = {
  id: 'rose',
  name: 'Rose',
  description: 'Soft rose pink accents, rounded edges. Elegant and approachable.',
  tags: ['light', 'elegant', 'feminine'],
  config: {
    accentColor: '#f43f5e',
    borderRadius: 'lg',
    flat: false,
    spacing: 'normal',
    animations: true,
    motion: 'smooth',
    mode: 'system',
    fontDisplay: 'Sora, system-ui, sans-serif',
    fontBody: 'Onest, system-ui, sans-serif',
  },
}

const cyber: ThemePreset = {
  id: 'cyber',
  name: 'Cyber',
  description: 'Cyan-on-dark with snappy animations. Terminal/cyber aesthetic.',
  tags: ['dark', 'tech', 'futuristic'],
  config: {
    accentColor: '#22d3ee',
    borderRadius: 'sm',
    flat: false,
    spacing: 'normal',
    animations: true,
    motion: 'snappy',
    mode: 'dark',
    fontDisplay: 'Sora, system-ui, sans-serif',
    fontBody: 'Onest, system-ui, sans-serif',
  },
}

const paper: ThemePreset = {
  id: 'paper',
  name: 'Paper',
  description: 'Warm paper tones, flat design. Optimized for reading and long-form content.',
  tags: ['light', 'minimal', 'reading'],
  config: {
    accentColor: '#78716c',
    borderRadius: 'sm',
    flat: true,
    spacing: 'compact',
    animations: true,
    motion: 'smooth',
    mode: 'light',
    fontDisplay: 'Sora, system-ui, sans-serif',
    fontBody: 'Onest, system-ui, sans-serif',
  },
}

export const PRESETS: Record<string, ThemePreset> = {
  ocean,
  minimal,
  bold,
  midnight,
  forest,
  sunset,
  slate,
  rose,
  cyber,
  paper,
}

export const PRESET_LIST: ThemePreset[] = [
  ocean,
  minimal,
  bold,
  midnight,
  forest,
  sunset,
  slate,
  rose,
  cyber,
  paper,
]

export function getPreset(id: string): ThemePreset | undefined {
  return PRESETS[id]
}
