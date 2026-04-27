import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A1020',
        slate: '#1D2A44',
        cobalt: '#2051F7',
        signal: '#F97316',
        paper: '#F6F8FC'
      },
      borderRadius: {
        sharp: '4px',
        panel: '14px'
      },
      spacing: {
        rhythm: '1.125rem',
        gutter: '1.75rem'
      },
      boxShadow: {
        edge: '0 1px 0 rgba(10, 16, 32, 0.08), 0 14px 24px rgba(10, 16, 32, 0.08)'
      }
    }
  },
  plugins: []
} satisfies Config;
