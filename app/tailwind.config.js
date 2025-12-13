export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        'slow': 'cubic-bezier(.405, 0, .025, 1)',
        'minor-spring': 'cubic-bezier(0.18,0.89,0.82,1.04)',
      },
      fontFamily: {
        epilogue: ['Epilogue', 'sans-serif'],
      }
    },
  },
  plugins: [],
}