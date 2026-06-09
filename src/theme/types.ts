/** Border radius preset key. Maps to specific pixel values at runtime. */
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

/** Spacing density preset key. Controls gap and padding scale. */
export type Spacing = 'compact' | 'normal' | 'spacious';

/** Motion curve preset key. Controls animation easing. */
export type Motion = 'snappy' | 'smooth' | 'reduced';

/** Elevation preset key. Controls shadow depth. */
export type Elevation = 'flat' | 'raised' | 'floating';

/** Color mode preference. `'system'` defers to the OS-level prefers-color-scheme. */
export type ColorMode = 'light' | 'dark' | 'system';

/** Partial theme configuration passed by consumers. Unset fields fall back to defaults. */
export interface ThemeConfig {
  /** Primary accent color in oklch or hex. @default 'oklch(60% 0.15 30)' */
  accentColor?: string;
  /** Primary brand color in oklch or hex. @default 'oklch(50% 0.10 185)' */
  primaryColor?: string;
  /** Primary brand color for dark mode. Falls back to primaryColor if unset. @default 'oklch(68% 0.08 185)' */
  darkPrimaryColor?: string;
  /** Accent color for dark mode. Falls back to accentColor if unset. @default 'oklch(72% 0.12 30)' */
  darkAccentColor?: string;
  /** Border radius preset. @default 'md' */
  borderRadius?: BorderRadius;
  /** When true, forces elevation to flat regardless of the elevation setting. @default false */
  flat?: boolean;
  /** Shadow depth preset. Ignored when flat is true. @default 'raised' */
  elevation?: Elevation;
  /** Spacing density preset. @default 'normal' */
  spacing?: Spacing;
  /** Enable animation and transition styles. @default true */
  animations?: boolean;
  /** Motion easing preset. @default 'snappy' */
  motion?: Motion;
  /** Color mode. @default 'system' */
  mode?: ColorMode;
  /** Font stack for display / heading text. @default "'Onest', system-ui, sans-serif" */
  fontDisplay?: string;
  /** Font stack for body text. @default "'Onest', system-ui, sans-serif" */
  fontBody?: string;
}

/** Fully resolved theme tokens emitted by the ThemeProvider. All fields are guaranteed to be set. */
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

/** Default theme configuration used when no overrides are provided by the consumer. */
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
  fontDisplay: "'Onest', system-ui, sans-serif",
  fontBody: "'Onest', system-ui, sans-serif",
};
