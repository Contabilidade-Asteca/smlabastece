/*
 * TailwindCSS configuration
 *
 * The `content` array tells Tailwind where to look for classes to purge
 * unused styles in production builds.  We target the root index.html and
 * all JavaScript/JSX/TSX files in the src/ directory.  Additional
 * customization (colours, spacing, etc.) can be added under `extend`.
 */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};