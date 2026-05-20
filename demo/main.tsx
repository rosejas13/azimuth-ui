import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, COLOR_PRESETS, COLOR_PRESET_LIST, STYLE_PRESETS, STYLE_PRESET_LIST, type ThemeConfig } from '../src/theme';
import type { ColorPreset, StylePreset } from '../src/theme';
import { App } from './App';

function DemoShell() {
  const [colorId, setColorId] = useState('ocean');
  const [styleId, setStyleId] = useState('balanced');

  const themeConfig: ThemeConfig = {
    ...COLOR_PRESETS[colorId]!.config,
    ...STYLE_PRESETS[styleId]!.config,
  };

  const handleColorChange = useCallback((id: string) => {
    setColorId(id);
  }, []);

  const handleStyleChange = useCallback((id: string) => {
    setStyleId(id);
  }, []);

  return (
    <ThemeProvider config={themeConfig}>
      <App
        currentColor={colorId}
        colors={COLOR_PRESET_LIST}
        onColorChange={handleColorChange}
        currentStyle={styleId}
        styles={STYLE_PRESET_LIST}
        onStyleChange={handleStyleChange}
      />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DemoShell />
  </React.StrictMode>,
);
