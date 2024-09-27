/** @type {import('tailwindcss').Config} */
export default {
  content: [ 
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.purple.300'),
            a: {
              color: theme('colors.purple.400'),
              '&:hover': {
                color: theme('colors.purple.300'),
              },
            },
            h1: {
              color: theme('colors.purple.400'),
            },
            h2: {
              color: theme('colors.purple.400'),
            },
            h3: {
              color: theme('colors.purple.400'),
            },
            strong: {
              color: theme('colors.purple.400'),
            },
            code: {
              color: theme('colors.purple.300'),
            },
            figcaption: {
              color: theme('colors.purple.300'),
            },
            maxWidth: '100%',
            img: {
              maxWidth: '100%',
              height: 'auto',
            },
            pre: {
              overflowX: 'auto',
              maxWidth: '100%',
            },
            code: {
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

