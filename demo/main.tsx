import React from 'react';
import ReactDOM from 'react-dom/client';
import axe from '@axe-core/react';
import { ThemeProvider, ToastProvider } from '../src';
import { App } from './App';

if (import.meta.env.DEV) {
  axe(React, ReactDOM, 1000);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
