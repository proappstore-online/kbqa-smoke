import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — fall back to concrete values if CSS vars are not injected
        background: 'var(--background, #ffffff)',
        foreground: 'var(--foreground, #111827)',
        border: 'var(--border, #e5e7eb)',
        muted: 'var(--muted, #f3f4f6)',
        primary: {
          DEFAULT: 'var(--primary, #3b82f6)',
          foreground: 'var(--primary-foreground, #ffffff)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
