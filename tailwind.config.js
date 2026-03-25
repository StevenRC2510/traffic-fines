/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        page: '900px',
      },
      colors: {
        // Primary action (buttons, selected borders)
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          active: '#1e40af',
        },

        // Category badge colors (WCAG AA compliant on white text)
        'category-traffic': '#dc2626',
        'category-parking': '#1d4ed8',
        'category-license': '#92400e',

        // Status badge colors (WCAG AA compliant on white text)
        'status-active': '#15803d',
        'status-overdue': '#9a3412',
        'status-severe': '#b91c1c',

        // Fine selection state
        'fine-selected-border': '#2563eb',
        'fine-selected-bg': '#eff6ff',

        // Error state
        'error-bg': '#fef2f2',
        'error-border': '#fecaca',
        'error-text': '#991b1b',

        // Discount text (WCAG AA compliant on white bg)
        'discount': '#15803d',

        // Due date warning (WCAG AA compliant on white bg)
        'due-warning': '#b45309',
      },
    },
  },
  plugins: [],
};
