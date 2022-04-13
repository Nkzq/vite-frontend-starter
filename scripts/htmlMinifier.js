import { minify } from 'html-minifier-terser'

import config from '../config.js'

const { htmlMinify } = config

const htmlMinifierPlugin = () => {
  if (!htmlMinify.enable) return false
  return {
    name: 'html-minifier',
    enforce: 'post',
    async transformIndexHtml(html) {
      const code = await minify(html, {
        ...htmlMinify.options,
      })

      return code
    }
  }
}

export default htmlMinifierPlugin