export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type Spacing = 'compact' | 'normal' | 'spacious';

export type Motion = 'snappy' | 'smooth' | 'reduced';

export type Elevation = 'flat' | 'raised' | 'floating';

export type ColorMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  accentColor?: string;
  primaryColor?: string;
  darkPrimaryColor?: string;
  darkAccentColor?: string;
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
  accentColor: 'oklch(60% 0.15 30)',
  primaryColor: 'oklch(50% 0.10 185)',
  darkPrimaryColor: 'oklch(68% 0.08 185)',
  darkAccentColor: 'oklch(72% 0.12 30)',
  borderRadius: 'md',
  flat: false,
  elevation: 'raised',
  spacing: 'normal',
  animations: true,
  motion: 'snappy',
  mode: 'system',
  fontDisplay: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontBody: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};
