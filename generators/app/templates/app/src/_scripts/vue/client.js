// Enable HMR
if (module.hot) module.hot.accept()

// Using Webpack's DefinePlugin we can use global constants such as devMode to have some code (e.g. logging) stay in our codebase but be stripped out during production builds
if (DEVMODE) console.log('Dev mode active')

// Webpack entrypoint for global styles
import './global-styles/main'
<% if (browserSupport === 'legacy') { %>
// Polyfills
if (!Array.from) {
  Array.from = object => {
    'use strict'
    return [].slice.call(object)
  }
}
if (!String.prototype.includes) {
  String.prototype.includes = function () { // eslint-disable-line
    'use strict'
    return String.prototype.indexOf.apply(this, arguments) !== -1
  }
}
import 'classlist.js'
import 'es6-promise'
import 'matchmedia-polyfill'
<% } %>
// Vue initialisation
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
Vue.use(VueRouter)
Vue.use(VueI18n)

import routes from './routes'
const router = new VueRouter({
  mode: 'history',
  routes
})

Vue.config.lang = 'en'
Vue.config.fallbackLang = 'en'
import locales from '../locales/index'
for (const lang of Object.keys(locales)) Vue.locale(lang, locales[lang])

import Base from './Base'
new Vue({ // eslint-disable-line no-new
  router,
  el: document.querySelector('.js-app'),
  render: h => h(Base)
})
