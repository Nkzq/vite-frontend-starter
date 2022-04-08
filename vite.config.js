import path, { dirname }  from 'path'
import glob from 'glob'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import twig from 'vite-plugin-twig'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import viteImagemin from 'vite-plugin-imagemin'

import config from './config.js'
import purgeCSSPlugin from './scripts/purgecss.js'
import criticalPlugin from './scripts/critical.js'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const file = fileURLToPath(import.meta.url)
const dir = dirname(file)
const { rootDir, buildDir, server, imagemin } = config

// JSON data
const fr = require(`./${rootDir}/data/fr.json`)

export default defineConfig ({
  server: {
    port: server.port,
    host: server.host,
  },
  root: path.join(dir, rootDir),
  build: {
    outDir: path.join(dir, buildDir),
    rollupOptions: {
      input: glob.sync(path.resolve(dir, `${rootDir}/**`, '*.html')),
    },
  },
  plugins: [
    twig({
      globals: {
        data: {
          fr,
        }
      }
    }),
    viteImagemin(imagemin),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), `${rootDir}/icons`)],
      symbolId: 'icon-[name]',
      inject: 'body-last',
      customDomId: 'sprite',
    }),
    purgeCSSPlugin(),
    criticalPlugin(),
  ],
})