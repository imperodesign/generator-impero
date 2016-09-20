'use strict'

const webpack = require('webpack')
const autoprefixer = require('autoprefixer')<% if (cssLang === 'Sass' || cssLang === 'Sass (SCSS)') { %>
const sassImporter = require('sass-module-importer')<% } %><% if (cssLang === 'Stylus') { %>
const rupture = require('rupture')<% } %>

module.exports = {
  context: __dirname,
  entry: './app/src/scripts/main.<%= jsExt %>',
  output: {
    path: __dirname + '/app/assets/dist',
    publicPath: '/assets/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.<%= jsExt %>$/,
        loader: '<%= jsLoader %>',
        query: {
          presets: ['es2015', 'stage-1']
        },
        exclude: /node_modules/
      },
      {
        test: /\.<%= cssExt %>$/,
        loaders: [
          'style',
          'css',
          'csso',
          'postcss',
          '<%= cssLoader %>'
        ]
      }
    ]
  },
  postcss: () => [autoprefixer],<% if (cssLang === 'Sass' || cssLang === 'Sass (SCSS)') { %>
  sassLoader: {
    importer: sassImporter()
  }<% } %><% if (cssLang === 'Stylus') { %>
  stylus: {
    use: [rupture()]
  }<% } %>
}
