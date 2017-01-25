module.exports = {
  langs: {
    cssLang: {
      stylus: {
        name: 'stylus',
        templateDir: 'stylus',
        loader: 'stylus-loader',
        fileExt: 'styl'
      },
      sass: {
        name: 'sass',
        templateDir: 'sass',
        loader: 'sass-loader',
        fileExt: 'sass'
      },
      scss: {
        name: 'scss',
        templateDir: 'scss',
        loader: 'sass-loader',
        fileExt: 'scss'
      }
    },
    jsLang: {
      vanilla: {
        name: 'vanilla',
        templateDir: 'vanilla',
        loader: 'babel-loader',
        fileExt: 'js',
        linter: 'eslint-loader'
      },
      vue: {
        name: 'vue',
        templateDir: 'vue',
        loader: 'babel-loader', // vue-loader is added separately
        fileExt: 'js',
        linter: 'eslint-loader'
      },
      react: {
        name: 'react',
        templateDir: 'react',
        loader: 'babel-loader',
        fileExt: 'js',
        linter: 'eslint-loader'
      }
    }
  },

  conditionalDeps: {
    deps: {
      legacy: {
        'classlist.js': '^1.1.20150312',
        'es6-promise': '^4.0.5',
        'matchmedia-polyfill': '^0.3.0',
      },
      js: {
        vanilla: {},
        vue: {
          'vue': '^2.1.4',
          'vue-i18n': '^4.7.4',
          'vue-router': '^2.1.1'
        },
        react: {
          'react': '^15.3.2',
          'react-dom': '^15.3.2'
        }
      }
    },
    devDeps: {
      css: {
        sass: {
          'breakpoint-sass': '^2.7.0',
          'node-sass': '^3.13.0',
          'sass-loader': '^4.0.2'
        },
        scss: {
          'breakpoint-sass': '^2.7.0',
          'node-sass': '^3.13.0',
          'sass-loader': '^4.0.2'
        },
        stylus: {
          'rupture': '^0.6.1',
          'stylus': '^0.54.5',
          'stylus-loader': '^2.3.1'
        }
      },
      js: {
        vanilla: {
          'babel-eslint': '^7.1.1',
          'browser-sync': '^2.17.5',
          'browser-sync-webpack-plugin': '^1.1.3',
          'eslint': '^3.11.1',
          'eslint-config-standard': '^6.2.1',
          'eslint-import-resolver-webpack': '^0.8.0',
          'eslint-loader': '^1.6.1',
          'eslint-plugin-import': '^2.2.0',
          'eslint-plugin-promise': '^3.4.0',
          'eslint-plugin-standard': '^2.0.1'
        },
        vue: {
          'babel-eslint': '^7.1.1',
          'eslint': '^3.11.1',
          'eslint-config-standard': '^6.2.1',
          'eslint-import-resolver-webpack': '^0.8.0',
          'eslint-loader': '^1.6.1',
          'eslint-plugin-html': '^1.7.0',
          'eslint-plugin-import': '^2.2.0',
          'eslint-plugin-promise': '^3.4.0',
          'eslint-plugin-standard': '^2.0.1',
          'pug-loader': '^2.3.0',
          'vue-loader': '^10.0.2',
          'vue-template-compiler': '^2.1.4'
        },
        react: {
          'babel-eslint': '^7.1.1',
          'babel-preset-react': '^6.16.0',
          'browser-sync': '^2.17.5',
          'browser-sync-webpack-plugin': '^1.1.3',
          'eslint': '^3.11.1',
          'eslint-config-standard': '^6.2.1',
          'eslint-config-standard-jsx': '^3.2.0',
          'eslint-config-standard-react': '^4.2.0',
          'eslint-import-resolver-webpack': '^0.8.0',
          'eslint-loader': '^1.6.1',
          'eslint-plugin-import': '^2.2.0',
          'eslint-plugin-promise': '^3.4.0',
          'eslint-plugin-react': '^6.6.0',
          'eslint-plugin-standard': '^2.0.1',
          'react-hot-loader': '^3.0.0-beta.6'
        }
      }
    }
  }
}
