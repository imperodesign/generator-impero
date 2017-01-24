'use strict'

const yeoman = require('yeoman-generator')
const chalk = require('chalk')
const emoji = require('node-emoji')
const yosay = require('yosay')
const username = require('username')
const extend = require('lodash').merge
const commandExists = require('command-exists')
const validateNpmName = require('validate-npm-package-name')
const sortNpmDeps = require('./sortNpmDeps')

const shortLoaderNotation = longNotation => longNotation.replace('-loader', '')

const escapeStrForJSON = string => string.replace(/"/g, '')

const langConfig = {
  cssLang: {
    'stylus': {
      name: 'stylus',
      templateDir: 'stylus',
      loader: 'stylus-loader',
      fileExt: 'styl'
    },
    'sass': {
      name: 'sass',
      templateDir: 'sass',
      loader: 'sass-loader',
      fileExt: 'sass'
    },
    'scss': {
      name: 'scss',
      templateDir: 'scss',
      loader: 'sass-loader',
      fileExt: 'scss'
    }
  },
  'jsLang': {
    'vanilla': {
      name: 'vanilla',
      templateDir: 'vanilla',
      loader: 'babel-loader',
      fileExt: 'js',
      linter: 'eslint-loader'
    },
    'vue': {
      name: 'vue',
      templateDir: 'vue',
      loader: 'babel-loader', // vue-loader is added separately
      fileExt: 'js',
      linter: 'eslint-loader'
    },
    'react': {
      name: 'react',
      templateDir: 'react',
      loader: 'babel-loader',
      fileExt: 'js',
      linter: 'eslint-loader'
    }
  }
}

module.exports = yeoman.Base.extend({
  prompting () {
    // Have Yeoman greet the user.
    this.log(yosay(
      `Welcome to the ${chalk.yellow('Impero')} generator!`
    ))

    this.log(`\n---\nNote that Yeoman will generate the project within the CWD... ${emoji.get('skull_and_crossbones')}\n---\n`)

    const prompts = [{
      type: 'input',
      name: 'projectName',
      message: `Project name (must be ${chalk.underline('unique')} and ${chalk.underline('alphanumeric only')})?`,
      // Defaults to the project's folder name if the input is skipped
      default: this.appname,
      validate: input => validateNpmName(input).validForNewPackages
    }, {
      type: 'input',
      name: 'description',
      message: 'Project description?',
      default: 'A new project generated by the Impero generator.'
    }, {
      type: 'input',
      name: 'author',
      message: 'Project author?',
      default: username.sync()
    }, {
      type: 'list',
      name: 'cssLang',
      message: 'Which CSS preprocessor?',
      choices: [
        { name: 'Stylus', value: 'stylus' },
        { name: 'Sass', value: 'sass' },
        { name: 'Sass (SCSS)', value: 'scss' }
      ],
      default: 'stylus'
    }, {
      type: 'list',
      name: 'jsLang',
      message: 'Which JS feature set? (all include Babel)',
      choices: [
        { name: 'Vanilla', value: 'vanilla' },
        { name: 'Vue (incl/ vue-router & vue-i18n)', value: 'vue' },
        { name: 'React', value: 'react' }
      ],
      default: 'vanilla'
    }, {
      type: 'list',
      name: 'browserSupport',
      message: 'Browser support?',
      choices: [
        { name: 'Legacy (IE9+)', value: 'legacy' },
        { name: 'Modern (Chrome, Firefox, Edge, Safari)', value: 'modern' }
      ],
      default: 'legacy'
    }, {
      type: 'confirm',
      name: 'copyEnv',
      message: 'Copy .env.example to .env?',
      default: true
    }, {
      type: 'confirm',
      name: 'installDeps',
      message: 'Install dependencies?',
      default: true
    }]

    return this.prompt(prompts).then(answers => {
      this.props = answers

      // Populate cssLang and jsLang data from previously defined object
      // Data is specified this way so as to allow easier testing of prompts
      // It also has the benefit of keeping all the config data together
      for (const lang in langConfig) this.props[lang] = langConfig[lang][this.props[lang]]

      // Pass the project name to a potential parent generator
      this.options.projectName = this.props.projectName
    })
  },

  writing () {
    // Copy templated files
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'), {
        jsLang: this.props.jsLang.name
      }
    )
    this.fs.copyTpl(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig'), {
        cssExt: this.props.cssLang.fileExt
      }
    )
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'), {
        name: this.props.projectName,
        description: escapeStrForJSON(this.props.description),
        author: escapeStrForJSON(this.props.author)
      }
    )
    this.fs.copyTpl(
      this.templatePath('_README.md'),
      this.destinationPath('README.md'), {
        name: this.props.projectName,
        description: this.props.description,
        browserSupport: this.props.browserSupport,
        jsLang: this.props.jsLang.name
      }
    )
    this.fs.copyTpl(
      this.templatePath('build/'),
      this.destinationPath('build/'), {
        cssLang: this.props.cssLang.name,
        cssLoader: this.props.cssLang.loader,
        cssExt: this.props.cssLang.fileExt,
        jsLang: this.props.jsLang.name,
        jsLoader: this.props.jsLang.loader,
        jsExt: this.props.jsLang.fileExt,
        jsLinter: this.props.jsLang.linter,
        browserSupport: this.props.browserSupport
      }
    )
    this.fs.copyTpl(
      this.templatePath('app/server-routes.js'),
      this.props.jsLang.name === 'vue' ? this.destinationPath('app/api.js') : this.destinationPath('app/routes.js'), {
        jsLang: this.props.jsLang.name
      }
    )
    this.fs.copyTpl(
      this.templatePath('app/server.js'),
      this.destinationPath('app/server.js'), {
        jsLang: this.props.jsLang.name
      }
    )

    // Copy untemplated files
    this.fs.copy(
      this.templatePath('.env.example'),
      this.destinationPath('.env.example')
    )
    if (this.props.copyEnv) this.fs.copy(
      this.templatePath('.env.example'),
      this.destinationPath('.env')
    )
    this.fs.copyTpl(
      this.templatePath('.eslintrc'),
      this.destinationPath('.eslintrc'), {
        jsLang: this.props.jsLang.name
      }
    )
    // Prefixed with an underscore, else npm will rename it to .npmignore
    this.fs.copy(
      this.templatePath('_.gitignore'),
      this.destinationPath('.gitignore')
    )
    this.fs.copy(
      this.templatePath('CHANGELOG.md'),
      this.destinationPath('CHANGELOG.md')
    )
    if (this.props.jsLang.name === 'vue') this.fs.copy(
      this.templatePath('app/base-vue.pug'),
      this.destinationPath('app/base.pug')
    )
    this.fs.copy(
      this.templatePath('app/static/humans.txt'),
      this.destinationPath('app/static/humans.txt')
    )
    this.fs.copy(
      this.templatePath('app/static/img'),
      this.destinationPath('app/static/img')
    )
    if (this.props.jsLang.name !== 'vue') this.fs.copy(
      this.templatePath('app/views'),
      this.destinationPath('app/views')
    )

    // Copy CSS
    if (this.props.jsLang.name === 'vue') {
      this.fs.copy(
        this.templatePath(`app/src/_styles/${this.props.cssLang.templateDir}/base`),
        this.destinationPath('app/src/global-styles/base')
      )
      this.fs.copyTpl(
        this.templatePath(`app/src/_styles/${this.props.cssLang.templateDir}/index.${this.props.cssLang.fileExt}`),
        this.destinationPath(`app/src/global-styles/index.${this.props.cssLang.fileExt}`), {
          jsLang: this.props.jsLang.name
        }
      )
    } else {
      this.fs.copy(
        this.templatePath(`app/src/_styles/${this.props.cssLang.templateDir}/base`),
        this.destinationPath('app/src/styles/base')
      )
      this.fs.copy(
        this.templatePath(`app/src/_styles/${this.props.cssLang.templateDir}/components`),
        this.destinationPath('app/src/styles/components')
      )
      this.fs.copy(
        this.templatePath(`app/src/_styles/${this.props.cssLang.templateDir}/pages`),
        this.destinationPath('app/src/styles/pages')
      )
      this.fs.copyTpl(
        this.templatePath(`app/src/_styles/${this.props.cssLang.templateDir}/index.${this.props.cssLang.fileExt}`),
        this.destinationPath(`app/src/styles/index.${this.props.cssLang.fileExt}`), {
          jsLang: this.props.jsLang.name
        }
      )
    }

    // Copy JS
    this.fs.copyTpl(
      this.templatePath(`app/src/_scripts/${this.props.jsLang.templateDir}/client.${this.props.jsLang.fileExt}`),
      this.destinationPath(`app/src/client.${this.props.jsLang.fileExt}`), {
        browserSupport: this.props.browserSupport
      }
    )
    if (this.props.jsLang.name === 'vue') {
      this.fs.copy(
        this.templatePath(`app/src/_scripts/${this.props.jsLang.templateDir}/routes.${this.props.jsLang.fileExt}`),
        this.destinationPath(`app/src/routes.${this.props.jsLang.fileExt}`)
      )
      this.fs.copy(
        this.templatePath(`app/src/_scripts/${this.props.jsLang.templateDir}/Base.vue`),
        this.destinationPath(`app/src/Base.vue`)
      )
      this.fs.copyTpl(
        this.templatePath(`app/src/_scripts/${this.props.jsLang.templateDir}/components/Button.vue`),
        this.destinationPath('app/src/components/Button.vue'), {
          cssLang: this.props.cssLang.name,
          cssLoader: this.props.cssLang.name === 'sass' ? 'sass?indentedSyntax' : shortLoaderNotation(this.props.cssLang.loader)
        }
      )
      this.fs.copyTpl(
        this.templatePath(`app/src/_scripts/${this.props.jsLang.templateDir}/components/pages/404.vue`),
        this.destinationPath('app/src/components/pages/404.vue'), {
          cssLang: this.props.cssLang.name,
          cssLoader: this.props.cssLang.name === 'sass' ? 'sass?indentedSyntax' : shortLoaderNotation(this.props.cssLang.loader)
        }
      )
      this.fs.copyTpl(
        this.templatePath(`app/src/_scripts/${this.props.jsLang.templateDir}/components/pages/Home.vue`),
        this.destinationPath('app/src/components/pages/Home.vue'), {
          cssLang: this.props.cssLang.name,
          cssLoader: shortLoaderNotation(this.props.cssLang.loader),
          cssExt: this.props.cssLang.fileExt
        }
      )
      this.fs.copy(
        this.templatePath(`app/src/_scripts/${this.props.jsLang.templateDir}/components/pages/home/home.js`),
        this.destinationPath('app/src/components/pages/home/home.js')
      )
      this.fs.copy(
        this.templatePath(`app/src/_scripts/${this.props.jsLang.templateDir}/components/pages/home/home.pug`),
        this.destinationPath('app/src/components/pages/home/home.pug')
      )
      this.fs.copy(
        this.templatePath(`app/src/_scripts/${this.props.jsLang.templateDir}/components/pages/home/home.${this.props.cssLang.fileExt}`),
        this.destinationPath(`app/src/components/pages/home/home.${this.props.cssLang.fileExt}`)
      )
      this.fs.copy(
        this.templatePath('app/src/_scripts/_vue-locales'),
        this.destinationPath('app/locales')
      )
    } else {
      this.fs.copy(
        this.templatePath(`app/src/_scripts/${this.props.jsLang.templateDir}/modules`),
        this.destinationPath('app/src/modules')
      )
    }

    // Load dependencies from generated/copied package.json
    let deps = this.fs.readJSON(this.destinationPath('package.json'), {})

    // Define optional dependencies
    const legacyOptionalDeps = {
      'classlist.js': '^1.1.20150312',
      'es6-promise': '^4.0.5',
      'matchmedia-polyfill': '^0.3.0',
    }

    const cssOptionalDevDeps = {
      'sass': {
        'breakpoint-sass': '^2.7.0',
        'node-sass': '^3.13.0',
        'sass-loader': '^4.0.2'
      },
      'scss': {
        'breakpoint-sass': '^2.7.0',
        'node-sass': '^3.13.0',
        'sass-loader': '^4.0.2'
      },
      'stylus': {
        'rupture': '^0.6.1',
        'stylus': '^0.54.5',
        'stylus-loader': '^2.3.1'
      }
    }

    const jsOptionalDeps = {
      'vanilla': {},
      'vue': {
        'vue': '^2.1.4',
        'vue-i18n': '^4.7.4',
        'vue-router': '^2.1.1'
      },
      'react': {
        'react': '^15.3.2',
        'react-dom': '^15.3.2'
      }
    }

    const jsOptionalDevDeps = {
      'vanilla': {
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
      'vue': {
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
      'react': {
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

    // Merge them as selected
    if (this.props.browserSupport === 'legacy') extend(deps, {
      dependencies: legacyOptionalDeps
    })

    extend(deps, {
      dependencies: jsOptionalDeps[this.props.jsLang.name]
    })

    extend(deps, {
      devDependencies: cssOptionalDevDeps[this.props.cssLang.name]
    })

    extend(deps, {
      devDependencies: jsOptionalDevDeps[this.props.jsLang.name]
    })

    // Sort the dependencies
    sortNpmDeps(deps)

    // Write to file
    this.fs.writeJSON(this.destinationPath('package.json'), deps)
  },

  install () {
    if (!this.props.installDeps) return

    // Install dependencies in scaffolded package.json
    // Use Yarn if available
    commandExists('yarn', (err, yes) => {
      if (yes) {
        this.log(`\n---\nNearly done! All that's left now is to run ${chalk.bgYellow.black('yarn install')}. Here goes... ${emoji.get('v')}\n---\n`)
        this.spawnCommand('yarn', ['install'])
      } else {
        // The installDependencies function built-in to Yeoman does not work
        // inside this commandExists function:
        this.log(`\n---\nNearly done! All that's left now is to run ${chalk.bgYellow.black('npm install')}. Here goes... ${emoji.get('v')}\n---\n`)
        this.spawnCommand('npm', ['install'])
      }
    })
  }
})
