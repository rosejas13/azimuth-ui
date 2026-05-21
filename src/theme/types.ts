export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type Spacing = 'compact' | 'normal' | 'spacious';

export type Motion = 'snappy' | 'smooth' | 'reduced';

export type Elevation = 'flat' | 'raised' | 'floating';

export type ColorMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  accentColor?: string;
  primaryColor?: string;
  borderRadius?: BorderRadius;
  flat?: boolean;
  elevation?: Elevation;
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
  elevation: Elevation;
  spacing: Spacing;
  animations: boolean;
  motion: Motion;
  mode: ColorMode;
  fontDisplay: string;
  fontBody: string;
}

export const DEFAULT_THEME: Required<ThemeConfig> = {
  accentColor: '#e8734a',
  primaryColor: '#2e9e8e',
  borderRadius: 'md',
  flat: false,
  elevation: 'raised',
  spacing: 'normal',
  animations: true,
  motion: 'snappy',
  mode: 'system',
  fontDisplay: 'Sora, system-ui, sans-serif',
  fontBody: 'Onest, system-ui, sans-serif',
};
