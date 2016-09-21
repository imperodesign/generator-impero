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
    // This is until these loaders are updated for the new config system
    new webpack.LoaderOptionsPlugin({
      options: {
        // Enables this workaround setup to work
        context: __dirname,
        // Actual options
        postcss: () => [autoprefixer],<% if (cssLang === 'Stylus') { %>
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
        query: {
          presets: ['es2015', 'es2016', 'es2017']
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
  }
}
