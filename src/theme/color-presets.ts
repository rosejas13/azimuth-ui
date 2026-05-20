export interface ColorPreset {
  id: string
  name: string
  description: string
  tags: string[]
  config: {
    primaryColor: string
    accentColor: string
    mode: 'light' | 'dark' | 'system'
  }
}

export const COLOR_PRESETS: Record<string, ColorPreset> = {
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Teal primary with warm coral accent. Balanced and professional.',
    tags: ['professional', 'saas'],
    config: { primaryColor: 'oklch(50% 0.13 195)', accentColor: 'oklch(65% 0.16 35)', mode: 'system' },
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep navy with indigo accent. Easy on the eyes in dark environments.',
    tags: ['dark', 'professional'],
    config: { primaryColor: 'oklch(65% 0.12 255)', accentColor: 'oklch(75% 0.10 265)', mode: 'dark' },
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Earthy green with emerald accents. Natural and grounded.',
    tags: ['natural', 'calm'],
    config: { primaryColor: 'oklch(50% 0.15 155)', accentColor: 'oklch(65% 0.16 165)', mode: 'system' },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm amber with orange accents. Inviting and creative.',
    tags: ['warm', 'creative'],
    config: { primaryColor: 'oklch(55% 0.12 50)', accentColor: 'oklch(65% 0.18 35)', mode: 'light' },
  },
  plum: {
    id: 'plum',
    name: 'Plum',
    description: 'Rich purple with pink accents. Expressive and distinct.',
    tags: ['bold', 'creative'],
    config: { primaryColor: 'oklch(45% 0.18 290)', accentColor: 'oklch(60% 0.15 310)', mode: 'system' },
  },
  slate: {
    id: 'slate',
    name: 'Slate',
    description: 'Cool grays with subtle blue undertones. Enterprise and utilitarian.',
    tags: ['minimal', 'enterprise'],
    config: { primaryColor: 'oklch(45% 0.03 240)', accentColor: 'oklch(55% 0.05 240)', mode: 'system' },
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    description: 'Soft rose with pink accents. Elegant and approachable.',
    tags: ['elegant', 'warm'],
    config: { primaryColor: 'oklch(50% 0.12 10)', accentColor: 'oklch(58% 0.16 0)', mode: 'system' },
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber',
    description: 'Neon cyan on dark. Terminal aesthetic, high contrast.',
    tags: ['dark', 'tech'],
    config: { primaryColor: 'oklch(75% 0.15 195)', accentColor: 'oklch(78% 0.18 210)', mode: 'dark' },
  },
  amber: {
    id: 'amber',
    name: 'Amber',
    description: 'Golden amber with warm yellow. Vintage and editorial feel.',
    tags: ['warm', 'vintage'],
    config: { primaryColor: 'oklch(55% 0.14 65)', accentColor: 'oklch(65% 0.16 55)', mode: 'light' },
  },
  mint: {
    id: 'mint',
    name: 'Mint',
    description: 'Cool mint green with aqua accents. Fresh and clean.',
    tags: ['fresh', 'clean'],
    config: { primaryColor: 'oklch(55% 0.10 170)', accentColor: 'oklch(65% 0.12 180)', mode: 'system' },
  },
}

export const COLOR_PRESET_LIST: ColorPreset[] = Object.values(COLOR_PRESETS)

export function getColorPreset(id: string): ColorPreset | undefined {
  return COLOR_PRESETS[id]
}
