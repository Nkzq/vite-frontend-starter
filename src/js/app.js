import lazySizes from 'lazysizes'
import 'lazysizes/plugins/native-loading/ls.native-loading'
import 'lazysizes/plugins/object-fit/ls.object-fit'
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks'
import '@babel/polyfill'
import '@babel/plugin-syntax-dynamic-import'
import * as conditioner from 'conditioner-core/conditioner-core.min'

import './polyfill/dataset'

import 'virtual:svg-icons-register'
import '../scss/app.scss'

document.documentElement.className = 'js'

conditioner.addPlugin({
  // the plugin "monitor" hook
  // use in html : <div data-module="component" data-context="@visible true"></div>
  monitor: {
    // the name of our monitor, not prefixed with "@"
    name: 'visible',
    // the monitor factory method, this will create our monitor
    create: (context, element) => ({
      // current match state
      matches: false,

      // called by conditioner to start listening for changes
      addListener(change) {
        new IntersectionObserver((entries) => {
          // update the matches state
          this.matches = entries.pop().isIntersecting === context;
          // inform conditioner of the new state
          change();
        }).observe(element)
      },
    }),
  },

  // converts module aliases to paths
  moduleSetName: (name) => `./modules/${name}.js`,

  // get the module constructor
  moduleGetConstructor: (module) => module.default,

  // override the import (this makes webpack bundle all the dynamically included files as well)
  // https://webpack.js.org/api/module-methods/#import-
  // - set to "eager" to create a single chunk for all modules
  // - set to "lazy" to create a separate chunk for each module
  moduleImport: (name) => import(/* @vite-ignore */ /* webpackMode: "lazy" */ `${name}`),
})

conditioner.hydrate(document.documentElement)

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false,
}