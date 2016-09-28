'use strict'

const fs = require('fs')
const webpack = require('webpack')
const browsersync = require('browser-sync-webpack-plugin')
const autoprefixer = require('autoprefixer')<% if (cssLang === 'Stylus') { %>
const rupture = require('rupture')<% } %>

if (fs.existsSync(`${__dirname}/.env`)) require('dotenv').load()
else {
  process.env.NODE_ENV = 'development'
  process.env.NODE_PORT = 5000
}

module.exports = {
  context: __dirname,
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    './app/src/scripts/main.<%= jsExt %>'
  ],
  output: {
    path: __dirname + '/app/assets/dist',
    publicPath: '/dev-assets',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.<%= jsExt %>', '.<%= cssExt %>']
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      DEVMODE: process.env.NODE_ENV === 'development'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new browsersync(
      // BrowserSync options
      {
        host: 'localhost',
        port: parseInt(process.env.NODE_PORT) + 1,
        proxy: `localhost:${process.env.NODE_PORT}`,
        ui: false,
        files: 'app/views/**/*.pug',
        open: false,
        notify: false,
        injectChanges: false
      },
      // Plugin options
      {
        reload: false
      }
    ),
    // This is until these loaders are updated for the new config system
    new webpack.LoaderOptionsPlugin({
      options: {
        // Enables this workaround setup to work
        context: __dirname,
        // Actual options
        eslint: {
          configFile: './.eslintrc',
          emitError: true,
          emitWarning: true
        },
        postcss: () => [autoprefixer]<% if (cssLang === 'Stylus') { %>,
        stylus: {
          use: [rupture()]
        }<% } %>
      }
    })
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.<%= jsExt %>$/,
        loader: '<%= jsLinter %>',
        exclude: /node_modules/
      },
      {
        test: /\.<%= jsExt %>$/,
        loader: '<%- jsLoader %>',
        query: {<% if (jsLang === 'React') { %>
          plugins: ['react-hot-loader/babel'],<% } %>
          presets: ['es2015', 'es2016', 'es2017', 'stage-1'<% if (jsLang === 'React') { %>, 'react'<% } %>]
        },
        exclude: /node_modules/
      },
      {
        test: /\.<%= cssExt %>$/,
        loaders: [
          'style?fixUrls', // This is to fix sourcemaps breaking relative URLs in CSS
          'css?sourceMap',
          'postcss',
          '<%= cssLoader %>?sourceMap'
        ]
      }
    ]
  }
}
