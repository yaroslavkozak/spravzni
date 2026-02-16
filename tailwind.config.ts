import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '375px',
      md: '768px',
      mdlg: '900px',
      lg: '1024px',
      xl: '1440px',
    },
    extend: {
      colors: {
        // Color variables will be defined here and can be updated from Figma design
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        green: {
          DEFAULT: '#28694D',
          dark: '#1f5239',
          light: '#3d8a5f',
        },
        white: {
          DEFAULT: '#FBFBF9',
          alt: '#FFFFFF',
          light: '#F8F8F3',
        },
        black: {
          DEFAULT: '#404040',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'], // Primary: Montserrat
        alternates: ['var(--font-alternates)', 'sans-serif'], // Secondary: Montserrat Alternates
        montserrat: ['var(--font-sans)', 'sans-serif'], // Montserrat
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        accent: ['var(--font-accent)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config

