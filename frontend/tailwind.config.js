/* global module */

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        /*
        ========================================
        EDUQUAKE PIXEL RPG PALETTE
        ========================================
        */

        background: "#0B1220",
        surface: "#1A120B",
        parchment: "#D8C29D",
        parchmentDark: "#C4AE84",

        wood: "#3A2416",
        woodDark: "#24150D",

        primary: "#D9A441",
        primaryHover: "#E8B85C",

        secondary: "#5FA34C",
        secondaryDark: "#3D6E32",

        danger: "#B13A2E",
        dangerDark: "#7D241D",

        accentBlue: "#3B5B8A",

        border: "#6B4E2E",
        borderDark: "#3B2A1A",

        textPrimary: "#2B1D0E",
        textSecondary: "#5B4630",

        glowGold: "#F6D28A",

        success: "#78C850",
        warning: "#E9A93D",
        error: "#D94C3A",

        xp: "#78C850",
        hp: "#D94C3A",
        mana: "#4D8BFF",

        shadow: "rgba(0,0,0,0.45)",
      },

      /*
      ========================================
      TYPOGRAPHY
      ========================================
      */

      fontFamily: {
        /*
        Main Pixel Headers
        */
        pixel: ['"Press Start 2P"', "cursive"],

        /*
        RPG Dialogue / HUD
        */
        terminal: ['"VT323"', "monospace"],

        /*
        Main UI / Readable Pixel
        */
        pixelui: ['"Pixelify Sans"', "sans-serif"],

        /*
        Parchment Book Text
        */
        parchment: ['"Cormorant Garamond"', "serif"],
      },

      /*
      ========================================
      BORDER RADIUS
      ========================================
      */

      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },

      /*
      ========================================
      SHADOWS
      ========================================
      */

      boxShadow: {
        pixel: "0 4px 0 #24150D",

        panel: `
          inset 0 0 0 2px #6B4E2E,
          0 6px 0 #24150D,
          0 10px 18px rgba(0,0,0,0.45)
        `,

        button: `
          inset 0 0 0 2px #E8B85C,
          0 4px 0 #7A4E12
        `,

        glow: `
          0 0 12px rgba(246,210,138,0.35)
        `,

        parchment: `
          inset 0 0 30px rgba(0,0,0,0.08)
        `,
      },

      /*
      ========================================
      BACKGROUNDS
      ========================================
      */

      backgroundImage: {
        wood: `
          linear-gradient(
            to bottom,
            #3A2416,
            #24150D
          )
        `,

        parchment: `
          linear-gradient(
            to bottom,
            #E4D3B2,
            #D8C29D
          )
        `,

        darkOverlay: `
          linear-gradient(
            to bottom,
            rgba(0,0,0,0.1),
            rgba(0,0,0,0.4)
          )
        `,
      },

      /*
      ========================================
      SPACING
      ========================================
      */

      spacing: {
        "layout-x": "32px",
        "layout-y": "24px",

        panel: "18px",

        bookPadding: "36px",

        sidebar: "220px",

        navbar: "72px",
      },

      /*
      ========================================
      ANIMATION
      ========================================
      */

      keyframes: {
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 6px rgba(246,210,138,0.15)",
          },
          "50%": {
            boxShadow: "0 0 18px rgba(246,210,138,0.4)",
          },
        },

        pulsePixel: {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.03)",
          },
        },

        floatPixel: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-2px)",
          },
        },
      },

      animation: {
        glow: "glow 2s ease-in-out infinite",
        pulsePixel: "pulsePixel 1.6s ease-in-out infinite",
        floatPixel: "floatPixel 2.5s ease-in-out infinite",
      },

      /*
      ========================================
      FONT SIZES
      ========================================
      */

      fontSize: {
        pixelxs: ["10px", "14px"],
        pixelsm: ["12px", "18px"],
        pixelbase: ["14px", "22px"],
        pixellg: ["18px", "26px"],
        pixelxl: ["24px", "32px"],
      },
    },
  },

  plugins: [],
};