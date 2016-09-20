'use strict'

const webpack = require('webpack')
const autoprefixer = require('autoprefixer')<% if (cssLang === 'Stylus') { %>
const rupture = require('rupture')<% } %>

if (!process.env.NODE_ENV) process.env.NODE_ENV === 'production'

module.exports = {
  context: __dirname,
  entry: './app/src/scripts/main.<%= jsExt %>',
  output: {
    path: __dirname + '/app/assets/dist',
    publicPath: '/assets/dist',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.<%= jsExt %>', '.<%= cssExt %>']
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      DEVMODE: process.env.NODE_ENV === 'development'
    }),
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
  postcss: () => [autoprefixer],<% if (cssLang === 'Stylus') { %>
  stylus: {
    use: [rupture()]
  }<% } %>
}
