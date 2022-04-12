import lazySizes from 'lazysizes'
import 'lazysizes/plugins/native-loading/ls.native-loading'
import 'lazysizes/plugins/object-fit/ls.object-fit'
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import '@babel/plugin-syntax-dynamic-import'
import * as conditioner from 'conditioner-core/conditioner-core.min'

import './polyfill/dataset'

import 'virtual:svg-icons-register'
import '../scss/app.scss'

document.documentElement.className = 'js'

conditioner.addPlugin({
  monitor: {
    name: 'visible',
    create: (context, element) => ({
      matches: false,
      addListener (change) {
        new IntersectionObserver((entries) => {
          this.matches = entries.pop().isIntersecting === context
          change()
        }).observe(element)
      }
    })
  },

  moduleSetName: (name) => `./modules/${name}.js`,
  moduleGetConstructor: (module) => module.default,
  moduleImport: (name) => import(/* @vite-ignore */`${name}`)
})

conditioner.hydrate(document.documentElement)

/**
 * Due to LazySizes dynamic src
 * We have to import all images to get them built
 */
const images = import.meta.globEager('../images/*') // eslint-disable-line

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false
}
