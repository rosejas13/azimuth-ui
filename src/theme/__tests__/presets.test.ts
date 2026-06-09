import { describe, it, expect } from 'vitest';
import {
  COLOR_PRESETS,
  COLOR_PRESET_LIST,
  getColorPreset,
} from '../color-presets';
import {
  STYLE_PRESETS,
  STYLE_PRESET_LIST,
  getStylePreset,
} from '../style-presets';

describe('COLOR_PRESETS', () => {
  it('has 10 presets', () => {
    expect(Object.keys(COLOR_PRESETS)).toHaveLength(10);
  });

  it('each preset has required fields', () => {
    for (const preset of Object.values(COLOR_PRESETS)) {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.config.primaryColor).toBeTruthy();
      expect(preset.config.accentColor).toBeTruthy();
      expect(preset.config.mode).toMatch(/^light|dark|system$/);
    }
  });

  it('COLOR_PRESET_LIST contains all presets', () => {
    expect(COLOR_PRESET_LIST).toHaveLength(10);
    expect(COLOR_PRESET_LIST[0].id).toBe(Object.keys(COLOR_PRESETS)[0]);
  });

  it('getColorPreset returns correct preset', () => {
    const preset = getColorPreset('ocean');
    expect(preset?.name).toBe('Ocean');
  });

  it('getColorPreset returns undefined for unknown id', () => {
    expect(getColorPreset('unknown')).toBeUndefined();
  });
});

describe('STYLE_PRESETS', () => {
  it('has 8 presets', () => {
    expect(Object.keys(STYLE_PRESETS)).toHaveLength(8);
  });

  it('each preset has required fields', () => {
    for (const preset of Object.values(STYLE_PRESETS)) {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.config).toBeTruthy();
    }
  });

  it('STYLE_PRESET_LIST contains all presets', () => {
    expect(STYLE_PRESET_LIST).toHaveLength(8);
  });

  it('getStylePreset returns correct preset', () => {
    const preset = getStylePreset('minimal');
    expect(preset?.name).toBe('Minimal');
  });

  it('getStylePreset returns undefined for unknown id', () => {
    expect(getStylePreset('unknown')).toBeUndefined();
  });
});
