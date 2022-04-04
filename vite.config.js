import path, { dirname }  from 'path'
import glob from 'glob'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import twig from 'vite-plugin-twig'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import viteImagemin from 'vite-plugin-imagemin'
import { PurgeCSS } from 'purgecss'
import critical from 'critical'

import env from './configuration/env.js'

// i18n
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const fr = require('./src/i18n/fr.json')
const en = require('./src/i18n/en.json')

const file = fileURLToPath(import.meta.url)
const dir = dirname(file)

const safeList = []

const purgeCSSPlugin = () => {
  let _html = ''
  return {
    name: 'purge-css',
    enforce: 'post',
    transformIndexHtml(html) {
      _html += html
    },
    async generateBundle(_options, bundle) {
      const cssFiles = Object.keys(bundle).filter(key => key.endsWith('.css'))
      if (!cssFiles) return
      for (const file of cssFiles) {
        const purged = await new PurgeCSS().purge({
          content: [{raw: _html, extension: 'html'}],
          css: [{raw: bundle[file].source}],
          safelist: safeList
        })
        bundle[file].source = purged[0].css
      }
    }
  }
}

const criticalPlugin = () => {
  return {
    name: 'critical-css',
    enforce: 'post',
    transform(src, id) {
      if (/\.(css)$/.test(id)) {
        console.log(src, id)
      }
    },
    async generateBundle(_options, bundle) {
      const htmlFiles = Object.keys(bundle).filter(key => key.endsWith('.html'))
      if (!htmlFiles) return
      for (const file of htmlFiles) {
        console.log(file, bundle[file])
        critical.generate({
          inline: true,
          html: bundle[file].source,
          base: 'dist/',
          target: {
            html: bundle[file].fileName,
          }
        })
      }
    }
  }
}

export default defineConfig ({
  server: {
    port: env.server.port,
    host: env.server.host,
  },
  root: path.join(dir, 'src'),
  build: {
    outDir: path.join(dir, 'dist'),
    rollupOptions: {
      input: glob.sync(path.resolve(dir, 'src/**', '*.html')),
    },
  },
  plugins: [
    twig({
      globals: {
        data: {
          fr,
          en,
        }
      }
    }),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      webp: {
        quality: 75,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 20,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[name]',
      inject: 'body-last',
      customDomId: 'sprite',
    }),
    purgeCSSPlugin(),
    criticalPlugin(),
  ],
})