/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{jsx,ts,tsx,js}'];
export const theme = {
  fontFamily: {
    //font family here
    normal: ['regular'],
    medium: ['medium'],
    semibold: ['semibold'],
    bold: ['bold'],
    regularNunito: ['regular-nunito'],
    lightNunito: ['light-nunito'],
    mediumNunito: ['medium-nunito'],
    semiboldNunito: ['semibold-nunito'],
    boldNunito: ['bold-nunito'],
    extraboldNunito: ['extrabold-nunito'],
    blackNunito: ['black-nunito'],
  },
  extend: {
    colors: {
      tprimary: {
        50: '#017FC8',
        100: '#0365A1',
      },
      twhite: {
        100: "#FFFFFF"
      },
      tblack: {
        50: "#444444",
        100: "#212121"
      },
      tgray: {
        xlight: '#F2F2F2',
        light: "#EEEEEE",
        50: "#DDDDDD",
        75: '#C0C0C0',
        100: "#1C1C1C",
        150: "#1B1B1B",
        200: "#DCDCDC",
        250: "#b3b3b3",
        300: "#787878",
        hov: "#F6F6F6",
      },
      tblue: {
        50: '#A4C7E9',
        75: 'rgba(0, 123, 255, 0.10)',
        100: '#E8F1F9',
        150: '#149DD1',
        200: '#007BFF'
      },
      error: {
        50: '#FFF7F6',
        75: '#FF6699',
        100: '#F25E43',
        150: '',
        200: '',
        500: '#DE1135'
      },
      success: {
        50: '#F2FCF2',
        100: '#00FF00',
        150: '#0BB02F',
      },

      /* ─────────────────────────────────────────────────────────────
       * TalkAM Design System v1.0 — Mental Wellness Edition
       * Source of truth: "TalkAM Design System.dc.html" § Foundation.
       * These are ADDITIVE. Nothing above this block is redefined, so
       * every existing v1 page keeps its current styling.
       * ───────────────────────────────────────────────────────────── */

      // Brand Navy — primary text, CTAs, dark surfaces
      navy: {
        900: '#0A1220',
        800: '#141B34',
        700: '#0D2240', // deep-blue gradient stop used in DS/landing heroes
        600: '#1E2D5A',
        400: '#2B4080',
        200: '#95A4C4',
        50: '#EEF1F8',
      },

      // Brand Blue — community actions, interactive, links
      brand: {
        600: '#015C94',
        400: '#017FC8', // primary brand colour
        200: '#68B4E1',
        100: '#A0F4FF',
        50: '#D1EEFE',
        25: '#EEF4FC', // pale chip/tint surface used throughout the decks
      },

      // Wellness Teal — therapy features, calm states (use sparingly)
      wellness: {
        600: '#1F6B59',
        400: '#3BA88F',
        200: '#7ECFC0',
        50: '#E8F7F4',
        25: '#E6F7F3',
      },

      // Premium Gold — verified therapists, premium tier, trust signals
      gold: {
        600: '#9A6E0A',
        500: '#B8861A',
        400: '#DBB66E',
        200: '#EDD9A5',
        100: '#FFF9E8',
        50: '#FBF5E8',
      },

      // Neutrals — text, borders, backgrounds, disabled
      ink: {
        950: '#0D0D0F',
        800: '#212121',
        600: '#444444',
        500: '#717171',
        400: '#858585',
        300: '#D2D2D2',
        200: '#E2E2E2',
        100: '#F0F0F2',
        50: '#F8F9FC',
      },

      // Semantic / system feedback states
      signal: {
        success: '#10B981',
        warning: '#FDAC0E',
        error: '#AC4242',
        info: '#017FC8',
      },

      // Semantic surface + tint pairs derived from the deck's usage of the
      // families above (badge/alert backgrounds and their text colours).
      surface: {
        page: '#F2F3F7',
        shell: '#EDEEF2',
        line: '#E8E9EF',
        muted: '#C4C8D4',
        errorTint: '#FFF0F0',
        errorInk: '#8B2E2E',
        errorField: '#FFF5F5',
      },
    },

    fontSize: {
      // DS type scale — [size, { lineHeight, fontWeight }]. Weights are
      // advisory here; the Nunito font-family classes carry the real weight.
      'display-xl': ['40px', { lineHeight: '1.1' }],
      'display': ['32px', { lineHeight: '1.15' }],
      'h1': ['28px', { lineHeight: '1.2' }],
      'h2': ['24px', { lineHeight: '1.25' }],
      'h3': ['20px', { lineHeight: '1.3' }],
      'h4': ['18px', { lineHeight: '1.35' }],
      'body-lg': ['16px', { lineHeight: '1.7' }],
      'body': ['14px', { lineHeight: '1.65' }],
      'caption': ['12px', { lineHeight: '1.5' }],
      'label': ['10px', { lineHeight: '1.4', letterSpacing: '0.06em' }],
    },

    // 4px base grid. Tailwind's default scale already covers 4/8/12/16/20/
    // 24/32/40/48/64 as 1..16, so only the named DS aliases are added.
    spacing: {
      'ds-1': '4px',
      'ds-2': '8px',
      'ds-3': '12px',
      'ds-4': '16px',
      'ds-5': '20px',
      'ds-6': '24px',
      'ds-8': '32px',
      'ds-10': '40px',
      'ds-12': '48px',
      'ds-16': '64px',
    },

    // Namespaced so Tailwind's rounded-lg / -xl / -2xl keep their current
    // values for every existing v1 page.
    borderRadius: {
      'ds-sm': '8px',    // tags & chips
      'ds-md': '12px',   // buttons & inputs
      'ds-lg': '16px',   // cards
      'ds-xl': '20px',   // modals
      'ds-2xl': '24px',  // feature panels
    },

    boxShadow: {
      box: '0px 1px 8px 0px rgba(0, 0, 0, 0.14)',
      danger: ' 0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #FEE4E2',
      gray: 'box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F2F4F7',

      // DS elevation — four depth levels
      e1: '0 1px 2px rgba(20,27,52,0.06), 0 1px 3px rgba(20,27,52,0.1)',
      e2: '0 4px 8px rgba(20,27,52,0.08), 0 2px 4px rgba(20,27,52,0.05)',
      e3: '0 10px 18px rgba(20,27,52,0.1), 0 4px 6px rgba(20,27,52,0.06)',
      e4: '0 24px 48px rgba(20,27,52,0.18), 0 8px 16px rgba(20,27,52,0.08)',
      // Focus rings called out in the DS input states
      'focus-brand': '0 0 0 3px rgba(1,127,200,0.14)',
      'focus-error': '0 0 0 3px rgba(172,66,66,0.10)',
    },

    backgroundImage: {
      'ds-hero': 'linear-gradient(135deg,#0A1220 0%,#141B34 55%,#0D2240 100%)',
      'ds-mark': 'linear-gradient(135deg,#017FC8,#3BA88F)',
      'ds-avatar': 'linear-gradient(135deg,#D1EEFE,#EEF4FC)',
    },

    backgroundColor: ['even'],
  },
};
export const variants = {
  extend: {
    display: ['group-focus']
  }
};
export const plugins = [
  // require('@tailwindcss/typography'),
  require('@tailwindcss/forms'),
  require('flowbite/plugin'),
  // require('@tailwindcss/line-clamp'),
  // require("daisyui"),
];
