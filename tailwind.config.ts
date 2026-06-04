import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  // Use 'class' strategy with a custom selector so dark: variants fire when
  // data-theme="dark" is set on <html> (NOT when a "dark" class is present).
  // This is the correct Tailwind v3 syntax — 'selector' is v4-only.
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(99 102 241)',
        'primary-foreground': 'rgb(255 255 255)',
        background: 'rgb(255 255 255)',
        foreground: 'rgb(15 23 42)',
      },
    },
  },
  plugins: [],
};

export default config;
