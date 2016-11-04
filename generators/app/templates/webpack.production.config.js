'use strict'

const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')<% if (cssLang === 'stylus') { %>
const rupture = require('rupture')<% } %>

if (!process.env.NODE_ENV) process.env.NODE_ENV === 'production'

module.exports = {
  context: __dirname,
  entry: './app/src/scripts/main.<%= jsExt %>',
  output: {
    path: __dirname + '/app/assets/dist',
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
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin('style.css'),
    // This is until these loaders are updated for the new config system
    new webpack.LoaderOptionsPlugin({
      options: {
        // Enables this workaround setup to work
        context: __dirname,
        // Actual options
        postcss: () => [
          autoprefixer({
            browsers: <% if (browserSupport === 'legacy') { %>['last 3 versions', 'ie >= 9']<% } %><% if (browserSupport === 'modern') { %>['last 1 version']<% } %>
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
        test: /\.<%= jsExt %>$/,
        loader: '<%= jsLoader %>',
        options: {<% if (jsLang === 'react') { %>
          plugins: ['react-hot-loader/babel'],<% } %>
          presets: ['es2015', 'es2016'<% if (jsLang === 'react') { %>, 'react'<% } %>]
        },
        exclude: /node_modules/
      },
      {
        test: /\.<%= cssExt %>$/,
        loader: ExtractTextPlugin.extract({
          loader: [
            'css?-autoprefixer', // Disable css-loader's internal autoprefixer
            'csso',
            'postcss',
            '<%= cssLoader %>'
          ],
          fallbackLoader: 'style'
        })
      }
    ]
  }
}
