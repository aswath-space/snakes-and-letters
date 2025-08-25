// Tailwind configuration defining theme extensions and source files
import type { Config } from 'tailwindcss';

export default {
  // Files to scan for class names
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom brand colors used throughout the UI
        primary: '#4a90e2',
        secondary: '#f5a623',
      },
      fontFamily: {
        // Use Inter as the default sans-serif font
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  // No additional plugins are required for the basic setup
  plugins: [],
} satisfies Config;
