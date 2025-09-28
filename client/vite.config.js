import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use a custom cache dir to avoid EPERM on OneDrive's locked .vite folder
  cacheDir: 'node_modules/.vite_cache',
  server: {
    port: 5173,
    // On some synced folders (OneDrive), polling avoids watcher issues
    watch: { usePolling: true }
  }
})
