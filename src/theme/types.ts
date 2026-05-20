export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type Spacing = 'compact' | 'normal' | 'spacious';

export type Motion = 'snappy' | 'smooth' | 'reduced';

export type ColorMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  accentColor?: string;
  borderRadius?: BorderRadius;
  flat?: boolean;
  spacing?: Spacing;
  animations?: boolean;
  motion?: Motion;
  mode?: ColorMode;
  fontDisplay?: string;
  fontBody?: string;
}

export interface ThemeTokens {
  accentColor: string;
  borderRadius: string;
  flat: boolean;
  spacing: Spacing;
  animations: boolean;
  motion: Motion;
  mode: ColorMode;
  fontDisplay: string;
  fontBody: string;
}

export const DEFAULT_THEME: Required<ThemeConfig> = {
  accentColor: '#e8734a',
  borderRadius: 'md',
  flat: false,
  spacing: 'normal',
  animations: true,
  motion: 'snappy',
  mode: 'system',
  fontDisplay: 'Sora, system-ui, sans-serif',
  fontBody: 'Onest, system-ui, sans-serif',
};
