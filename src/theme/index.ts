/** React component that provides theme context to its children. */
export { ThemeProvider } from './ThemeProvider';
/** Hook that returns the current theme tokens. */
export { useTheme } from './useTheme';
/** Hook that reads and sets the color mode with localStorage persistence. */
export { useThemeMode } from './useThemeMode';
/** React context holding the resolved theme token values. */
export { ThemeContext } from './ThemeContext';
/** Default theme configuration used when no overrides are provided. */
export { DEFAULT_THEME } from './types';
/** Color preset definitions and lookup utilities. */
export {
  COLOR_PRESETS,
  COLOR_PRESET_LIST,
  getColorPreset,
} from './color-presets';
/** Style preset definitions and lookup utilities. */
export {
  STYLE_PRESETS,
  STYLE_PRESET_LIST,
  getStylePreset,
} from './style-presets';
export type { ColorPreset } from './color-presets';
export type { StylePreset } from './style-presets';
export type {
  ThemeConfig,
  ThemeTokens,
  BorderRadius,
  Spacing,
  Motion,
  Elevation,
  ColorMode,
} from './types';
