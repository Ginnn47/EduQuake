/* global module */

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "surface-container-high": "#eae6de",
        "tertiary-fixed": "#f8e0a8",
        "primary-container": "#78a886",
        "primary-fixed": "#c8e8d0",
        "inverse-on-surface": "#f5f0e8",
        "primary-fixed-dim": "#8ecf9e",
        "on-primary": "#ffffff",
        "error-container": "#ffdad8",
        "outline-variant": "#c4c8bc",
        "surface-container": "#f0ece4",
        "secondary-fixed": "#f0e8db",
        "on-tertiary-fixed": "#221a05",
        "background": "#faf6f0",
        "on-error": "#ffffff",
        "on-primary-fixed": "#002110",
        "on-background": "#2e3230",
        "surface-variant": "#e4e0d8",
        "tertiary": "#705c30",
        "on-tertiary-container": "#554020",
        "on-surface": "#2e3230",
        "secondary-container": "#f0e8db",
        "on-tertiary": "#ffffff",
        "surface-container-low": "#f5f1ea",
        "surface-dim": "#dbd7cf",
        "on-secondary-fixed-variant": "#4a4538",
        "on-secondary-container": "#5e5548",
        "on-secondary": "#ffffff",
        "on-primary-fixed-variant": "#2a6038",
        "tertiary-container": "#c4a66a",
        "secondary-fixed-dim": "#d4ccbf",
        "on-secondary-fixed": "#1e1a13",
        "on-primary-container": "#d8f0de",
        "inverse-surface": "#2e3230",
        "inverse-primary": "#8ecf9e",
        "error": "#b83230",
        "tertiary-fixed-dim": "#dcc48e",
        "surface-container-lowest": "#ffffff",
        "secondary": "#6b6358",
        "surface-bright": "#faf6f0",
        "surface": "#faf6f0",
        "outline": "#74796e",
        "primary": "#4a7c59",
        "on-error-container": "#690005",
        "surface-container-highest": "#e4e0d8",
        "surface-tint": "#4a7c59",
        "on-surface-variant": "#4a4e4a",
        "on-tertiary-fixed-variant": "#554020"
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px"
      },
      fontFamily: {
        headline: ["Literata", "serif"],
        display: ["Literata", "serif"],
        body: ["Nunito Sans", "sans-serif"],
        label: ["Nunito Sans", "sans-serif"],
      },
      boxShadow: {
        custom: "0 4px 20px rgba(46,50,48,0.06)"
      },
      spacing: {
        'layout-x': '40px', // contoh spacing custom
      },
    },
  },
  plugins: [],
};
