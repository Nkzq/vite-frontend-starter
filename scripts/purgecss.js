import { PurgeCSS } from 'purgecss'
import config from '../config.js'

const purgeCSSPlugin = () => {
  if (!config.purgecss.enable) return false
  let _html = ''
  const safeList = config.purgecss.safeList || []
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

export default purgeCSSPlugin