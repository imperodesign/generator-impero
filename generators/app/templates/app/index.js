// Dependencies
require('dotenv').load()
const express = require('express')
const app = express()

// Configuration
app.set('port', process.env.NODE_PORT || 5000)
app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')
app.use('/assets', express.static(__dirname + '/assets'))

// Webpack HMR for development
if (process.env.NODE_ENV === 'development') {
  // Create & configure a webpack compiler
  const webpack = require('webpack')
  const webpackConfig = require('../webpack.config')
  const compiler = webpack(webpackConfig)

  // Attach the dev middleware to the compiler & the server
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))

  // Attach the hot middleware to the compiler & the server
  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }))
}

// Routes
require('./routes')(app)

// Start the server
app.listen(app.get('port'), err => {
  if (err) console.error(err)
  else console.log(`Server started: http://localhost:${app.get('port')}/`)
})
