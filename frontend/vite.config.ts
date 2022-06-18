import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  root: '',
  build: {
    outDir: '../backend/build/build_frontend'
  }
})
