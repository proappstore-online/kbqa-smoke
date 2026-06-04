/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background, #ffffff)',
        foreground: 'var(--color-foreground, #0f172a)',
        primary: 'var(--color-primary, #6366f1)',
        'primary-foreground': 'var(--color-primary-foreground, #ffffff)',
      },
    },
  },
  plugins: [],
}
