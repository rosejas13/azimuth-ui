import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, PRESETS, PRESET_LIST, type ThemePreset, type ThemeConfig } from '../src/theme';
import { App } from './App';

function DemoShell() {
  const [presetId, setPresetId] = useState('ocean');
  const preset = PRESETS[presetId]!;

  const handlePresetChange = useCallback((id: string) => {
    setPresetId(id);
  }, []);

  return (
    <ThemeProvider config={preset.config as ThemeConfig}>
      <App currentPreset={presetId} presets={PRESET_LIST} onPresetChange={handlePresetChange} />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DemoShell />
  </React.StrictMode>,
);
