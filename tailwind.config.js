/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Navy & Midnight Palette
        'navy-950': '#020617', // Main Background (Midnight)
        'navy-900': '#0F172A', // Sidebar/Board Background
        'navy-800': '#1E293B', // Card Background
        'navy-700': '#334155', // Borders/Dividers
        
        // Brand Accents for your Mosque Projects
        'accent-cyan': '#38BDF8', // Enquiry/Active state
        'accent-mint': '#34D399', // Quote/Success state
        'pearl': '#F8FAFC',       // Clean Off-White Text
      }
    },
  },
  plugins: [],
}
