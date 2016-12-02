'use strict'

const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')<% if (cssLang === 'stylus') { %>
const rupture = require('rupture')<% } %>

if (!process.env.NODE_ENV) process.env.NODE_ENV === 'production'

module.exports = {
  context: __dirname,
  target: 'web',
  entry: './app/src/client.<%= jsExt %>',
  output: {
    path: `${__dirname}/app/static/dist`,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.<%= jsExt %>', <% if (jsLang === 'vue') { %>'.vue', '.pug', <% } %>'.json', '.<%= cssExt %>']
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      DEVMODE: process.env.NODE_ENV === 'development'
    }),
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
            browsers: <% if (browserSupport === 'legacy') { %>['last 3 versions', 'ie >= 9']<% } else if (browserSupport === 'modern') { %>['last 1 version']<% } %>
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
        loader: ExtractTextPlugin.extract({
          loader: [
            'css-loader?-autoprefixer', // Disable css-loader's internal autoprefixer
            'csso-loader',
            'postcss-loader',
            '<%= cssLoader %>'
          ],
          fallbackLoader: 'style-loader'
        })
      }
    ]
  }
}
