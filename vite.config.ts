import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'

export default defineConfig(() => ({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['applet-apis']
    },
  },
  plugins: [
    dts()
  ]
}));