import { execSync } from 'node:child_process'
import fs from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

function getGitInfo(cmd, fallback = '') {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return fallback
  }
}

const gitCommit = getGitInfo('git rev-parse --short HEAD', 'local')
const gitCommitCount = getGitInfo('git rev-list --count HEAD', '1')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_COMMIT__: JSON.stringify(gitCommit),
    __APP_BUILD_NUMBER__: JSON.stringify(gitCommitCount),
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
})
