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
