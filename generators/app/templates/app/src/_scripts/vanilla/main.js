// Enable HMR
if (module.hot) {
  module.hot.accept()
}

// Webpack entrypoint for CSS
import '../styles/main.<%= cssExt %>'

// Babel is transpiling, and on top of that the polyfills below enable support for the following down to and including IE9:
// Array.from()
// String.prototype.includes()
// Element.classList
// Promises
// Window.matchMedia()
if (!Array.from) {
  Array.from = object => {
    'use strict'
    return [].slice.call(object)
  }
}
if (!String.prototype.includes) {
  String.prototype.includes = function () {
    'use strict'
    return String.prototype.indexOf.apply(this, arguments) !== -1
  }
}
import 'classlist.js'
import 'es6-promise'
import 'matchmedia-polyfill'

// Event emitter to allow communication between modules
import {EventEmitter} from 'events'
const app = new EventEmitter()

// And finally our modules for this project
// These two modules demonstrate the event emitter
import example from './modules/example'
example(app)

import example2 from './modules/example2'
example2(app)

// This code demonstrates the code splitting/chunking ability of Webpack
// The example3 module will only be loaded over the network upon us triggering the require code below
const exampleEl = document.querySelector('.js-example')
const exampleTriggerEl = document.querySelector('.js-example-trigger')

if (exampleEl && exampleTriggerEl) {
  exampleTriggerEl.addEventListener('submit', event => {
    event.preventDefault()

    require.ensure([], require => require('./modules/example3').default(exampleEl))
  })
}
