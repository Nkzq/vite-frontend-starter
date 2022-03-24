import twig from 'vite-plugin-twig'
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path  from 'path'

import env from './configuration/env'

// i18n
import fr from './src/i18n/fr.json'

export default defineConfig ({
  server: {
    port: env.server.port,
    host: env.server.host,
  },
  plugins: [
    twig({
      globals: {
        data: {
          fr,
        }
      }
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[name]',
      inject: 'body-last',
      customDomId: 'sprite',
    }),
  ],
})