'use strict'

const fs = require('fs')
const merge = require('lodash.merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base.config')<% if (jsLang !== 'vue') { %>
const browsersync = require('browser-sync-webpack-plugin')<% } %>
const autoprefixer = require('autoprefixer')<% if (cssLang === 'stylus') { %>
const rupture = require('rupture')<% } %>

// Set var with fallbacks in case the env file failed to load or the env var is missing
require('dotenv').config({ silent: true })

const port = Number(process.env.NODE_PORT) || 5000

module.exports = merge(baseConfig, {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    './app/src/client.<%= jsExt %>'
  ],
  output: {
    publicPath: '/dev-assets'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      DEVMODE: true
    }),
    new webpack.HotModuleReplacementPlugin(),<% if (jsLang !== 'vue') { %>
    new browsersync(
      // BrowserSync options
      {
        host: 'localhost',
        port: port + 1,
        proxy: `localhost:${String(port)}`,
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
    ),<% } %>
    // This is until these loaders are updated for the new config system
    new webpack.LoaderOptionsPlugin({
      options: {
        // Enables this workaround setup to work
        context: __dirname,
        // Actual options
        postcss: () => [
          autoprefixer({
            browsers: <% if (browserSupport === 'legacy') { %>['last 3 versions', 'ie >= 9', '> 1%']<% } else if (browserSupport === 'modern') { %>['last 1 version']<% } %>
          })
        ]<% if (cssLang === 'stylus') { %>,
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
        test: /\.<%= jsExt %>$<% if (jsLang === 'vue') { %>|.vue$<% } %>/,
        loader: '<%= jsLinter %>',<% if (jsLinter === 'eslint-loader') { %>
        options: {
          configFile: './.eslintrc',
          emitError: true,
          emitWarning: true
        },<% } %>
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.<%= jsExt %>$/,
        loader: '<%= jsLoader %>',
        exclude: /node_modules/
      },<% if (jsLang === 'vue') { %>
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },<% } %>
      {
        test: /\.<%= cssExt %>$/,
        loaders: [
          'style-loader?fixUrls', // This is to fix sourcemaps breaking relative URLs in CSS
          'css-loader?sourceMap&-autoprefixer', // Disable css-loader's internal autoprefixer
          'postcss-loader',
          '<%= cssLoader %>?sourceMap'
        ]
      }
    ]
  }
})
