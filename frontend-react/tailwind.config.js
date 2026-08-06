/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d6efd',
          soft: '#cfe2ff',
        },
        secondary: '#2e8b57',
        success: {
          DEFAULT: '#22c55e',
          soft: 'rgba(34, 197, 94, 0.12)',
          text: '#15803d',
        },
        danger: {
          DEFAULT: '#dc2626',
          soft: 'rgba(220, 38, 38, 0.12)',
          text: '#b91c1c',
        },
        warning: {
          DEFAULT: '#f59e0b',
          text: '#92400e',
        },
        info: '#0dcaf0',
        light: '#eef2f7',
        dark: '#0f172a',
        bg: '#eef2f7',
        surface: '#ffffff',
        ink: '#0f172a',
        muted: '#5b6b82',
        faint: '#8a95aa',
        line: '#d2dce5',
      },
      textColor: {
        success: '#22c55e',
        danger: '#dc2626',
        warning: '#f59e0b',
        info: '#0dcaf0',
      },
    },
  },
}
