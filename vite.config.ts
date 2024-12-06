import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss()],
    },
  },
  plugins: [react(), tsconfigPaths()],
})
