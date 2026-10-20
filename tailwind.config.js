/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#003F40',      // Sidebar, deep teal
          darker: '#002E2F',    // Darker accent
          emerald: '#008A62',   // Primary action buttons, active sidebar pill
          emeraldHover: '#006F50',
          emeraldLight: '#E8F7F2',
          cyanBg: '#F0FBFC',    // Main content background
          cyanLight: '#F7FDFF',
          cardBg: '#FFFFFF',
          border: '#D5EFF1',    // Thin card borders
          borderLight: '#E6F6F7',
          textPrimary: '#153B46',
          textSecondary: '#718A94',
          textMuted: '#94AAB2',
          success: '#16A879',
          successBg: '#E9F8F2',
          warning: '#F5A623',
          warningBg: '#FEF6E9',
          danger: '#F06464',
          dangerBg: '#FDEEEE',
          info: '#38A9D8',
          infoBg: '#EAF6FB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'pill': '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 63, 64, 0.05), 0 1px 2px rgba(0, 63, 64, 0.03)',
        'card': '0 2px 6px rgba(0, 63, 64, 0.04)',
        'dropdown': '0 4px 20px -2px rgba(0, 63, 64, 0.12)',
      }
    },
  },
  plugins: [],
}
