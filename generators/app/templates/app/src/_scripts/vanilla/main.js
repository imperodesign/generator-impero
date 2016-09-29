// Enable HMR
if (module.hot) module.hot.accept()

// Using Webpack's DefinePlugin we can use global constants such as devMode to have some code (e.g. logging) stay in our codebase but be stripped out during production builds
if (DEVMODE) console.log('Dev mode active')

// Webpack entrypoint for styles
import '../styles/main'
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
// This code demonstrates the code splitting/chunking ability of Webpack
// The example module will only be loaded over the network upon us triggering the require code below
const exampleEl = document.querySelector('.js-example')
const exampleTriggerEl = document.querySelector('.js-example-trigger')

if (exampleEl && exampleTriggerEl) {
  exampleTriggerEl.addEventListener('submit', event => {
    event.preventDefault()

    require.ensure([], require => require('./modules/example-require-ensure').default(exampleEl))
  })
}
