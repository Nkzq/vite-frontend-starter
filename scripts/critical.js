import critical from 'critical'
import config from '../config.js'

const criticalPlugin = () => {
  if (!config.critical.enable) return false
  return {
    name: 'critical-css',
    enforce: 'post',
    async generateBundle(_options, bundle) {
      const htmlFiles = Object.keys(bundle).filter(key => key.endsWith('.html'))
      if (!htmlFiles) return
      for (const file of htmlFiles) {
        critical.generate({
          inline: true,
          html: bundle[file].source,
          base: `${config.buildDir}/`,
          target: {
            html: bundle[file].fileName,
          },
          ignore: {
            atrule: ['@font-face'],
          },
        })
      }
    }
  }
}

export default criticalPlugin