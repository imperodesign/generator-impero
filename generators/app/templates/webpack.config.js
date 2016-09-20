'use strict'

const fs = require('fs')
const webpack = require('webpack')
const browsersync = require('browser-sync-webpack-plugin')
const autoprefixer = require('autoprefixer')<% if (cssLang === 'Sass' || cssLang === 'Sass (SCSS)') { %>
const sassImporter = require('sass-module-importer')<% } %><% if (cssLang === 'Stylus') { %>
const rupture = require('rupture')<% } %>

if (fs.existsSync(`${__dirname}/.env`)) require('dotenv').load()
else process.env.NODE_PORT = 5000

module.exports = {
  context: __dirname,
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    './app/src/scripts/main.<%= jsExt %>'
  ],
  output: {
    path: __dirname + '/app/assets/dist',
    publicPath: '/assets/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
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
    )
  ],
  module: {
    preLoaders: [
      {
        test: /\.<%= jsExt %>$/,
        loader: '<%= jsLinter %>',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.<%= jsExt %>$/,
        loader: '<%= jsLoader %>sourceMap',
        exclude: /node_modules/
      },
      {
        test: /\.<%= cssExt %>$/,
        loaders: [
          'style',
          'css?sourceMap',
          'postcss',
          '<%= cssLoader %>?sourceMap'
        ]
      }
    ]
  },
  eslint: {
    configFile: './.eslintrc',
    emitError: true,
    emitWarning: true
  },
  postcss: () => [autoprefixer],<% if (cssLang === 'Sass' || cssLang === 'Sass (SCSS)') { %>
  sassLoader: {
    importer: sassImporter()
  }<% } %><% if (cssLang === 'Stylus') { %>
  stylus: {
    use: [rupture()]
  }<% } %>
}
