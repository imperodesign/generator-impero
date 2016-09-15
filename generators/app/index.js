'use strict'

const yeoman = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const extend = require('lodash').merge

module.exports = yeoman.Base.extend({
  prompting () {
    // Have Yeoman greet the user.
    this.log(yosay(
      `Welcome to the ${chalk.yellow('Impero')} generator!`
    ))

    const prompts = [{
      type: 'input',
      name: 'name',
      message: `Your project name (must be ${chalk.underline('unique')})?`,
      //Defaults to the project's folder name if the input is skipped
      default: this.appname
    }, {
      type: 'input',
      name: 'description',
      message: 'Your project description?',
      default: ''
    }, {
      type: 'list',
      name: 'cssPreprocessor',
      message: 'Which CSS preprocessor?',
      // Sourdough is disabled until a Webpack-compatible loader is developed
      choices: [/*{
        name: 'Sourdough / SSS'
      }, */{
        name: 'Sass'
      }, {
        name: 'Sass (SCSS)'
      }, {
        name: 'Stylus'
      }],
      default: 0
    }, {
      type: 'confirm',
      name: 'copyEnv',
      message: 'Copy .env.example to .env?',
      default: true
    }]

    return this.prompt(prompts).then(answers => {
      // To access props later use this.props.exampleAnswer
      this.props = answers

      // Make array of CSS choice details
      const chosenCssPreprocessor = this.props.cssPreprocessor
      this.props.cssPreprocessor = {
        name: chosenCssPreprocessor
      }

      // Add additional details for each option
      // Better than making a load of additional files to copy instead
      switch (chosenCssPreprocessor) {
        case 'Sourdough / SSS':
          this.props.cssPreprocessor.templateDir = 'sourdough'
          this.props.cssPreprocessor.loader = 'TODO'
          this.props.cssPreprocessor.fileExt = 'sss'
          break
        case 'Sass':
          this.props.cssPreprocessor.templateDir = 'sass'
          this.props.cssPreprocessor.loader = 'sass'
          this.props.cssPreprocessor.fileExt = 'sass'
          break
        case 'Sass (SCSS)':
          this.props.cssPreprocessor.templateDir = 'scss'
          this.props.cssPreprocessor.loader = 'sass'
          this.props.cssPreprocessor.fileExt = 'scss'
          break
        case 'Stylus':
          this.props.cssPreprocessor.templateDir = 'stylus'
          this.props.cssPreprocessor.loader = 'stylus'
          this.props.cssPreprocessor.fileExt = 'styl'
          break
        // This should never happen
        default:
          break
      }
    })
  },

  writing () {
    // Copy templated files
    this.fs.copyTpl(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig'), {
        cssExt: this.props.cssPreprocessor.fileExt
      }
    )
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'), {
        name: this.props.name,
        description: this.props.description,
        cssChoice: this.props.cssPreprocessor.name,
        cssLoader: this.props.cssPreprocessor.loader
      }
    )
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'), {
        name: this.props.name,
        cssName: this.props.cssPreprocessor.name
      }
    )
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'), {
        cssChoice: this.props.cssPreprocessor.name,
        cssLoader: this.props.cssPreprocessor.loader,
        cssExt: this.props.cssPreprocessor.fileExt
      }
    )
    this.fs.copyTpl(
      this.templatePath('webpack.production.config.js'),
      this.destinationPath('webpack.production.config.js'), {
        cssChoice: this.props.cssPreprocessor.name,
        cssLoader: this.props.cssPreprocessor.loader,
        cssExt: this.props.cssPreprocessor.fileExt
      }
    )
    this.fs.copyTpl(
      this.templatePath('deploy'),
      this.destinationPath('deploy'), {
        name: this.props.name
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
    this.fs.copy(
      this.templatePath('.eslintrc'),
      this.destinationPath('.eslintrc')
    )
    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    )
    this.fs.copy(
      this.templatePath('Dockerfile'),
      this.destinationPath('Dockerfile')
    )
    this.fs.copy(
      this.templatePath('app/assets/humans.txt'),
      this.destinationPath('app/assets/humans.txt')
    )
    this.fs.copy(
      this.templatePath('app/assets/img/.gitkeep'),
      this.destinationPath('app/assets/img/.gitkeep')
    )
    this.fs.copy(
      this.templatePath('app/views'),
      this.destinationPath('app/views')
    )
    this.fs.copy(
      this.templatePath('app/index.js'),
      this.destinationPath('app/index.js')
    )
    this.fs.copy(
      this.templatePath('app/routes.js'),
      this.destinationPath('app/routes.js')
    )

    // Copy CSS
    this.fs.copy(
      this.templatePath(`app/src/_styles/${this.props.cssPreprocessor.templateDir}`),
      this.destinationPath('app/src/styles')
    )

    // Copy JS
    this.fs.copy(
      this.templatePath('app/src/_scripts/es2015'),
      this.destinationPath('app/src/scripts')
    )

    // Add dependencies based upon selected options
    let deps = this.fs.readJSON(this.destinationPath('package.json'), {})

    let cssOptionalDeps = {
      'Sass': {
        'node-sass': '^3.9.3',
        'sass-loader': '^4.0.2',
        'sass-module-importer': '^1.2.1'
      },
      'Sass (SCSS)': {
        'node-sass': '^3.9.3',
        'sass-loader': '^4.0.2',
        'sass-module-importer': '^1.2.1'
      },
      'Stylus': {
        'stylus-loader': '^2.3.1'
      }
    }

    extend(deps, {
      devDependencies: cssOptionalDeps[this.props.cssPreprocessor.name]
    })

    // Sort the dependencies
    // This is absolutely not needed but a nice-to-have :-)
    let sortedDeps = {}

    Object.keys(deps.devDependencies).sort().forEach(key => {
      sortedDeps[key] = deps.devDependencies[key]
    })

    deps.devDependencies = sortedDeps

    this.fs.writeJSON(this.destinationPath('package.json'), deps)
  },

  install () {
    // Install dependencies in scaffolded package.json
    this.installDependencies({
      bower: false
    })
  }
})
