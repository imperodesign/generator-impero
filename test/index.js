'use strict'

const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')
const cfg = require('./config')

const sharedTests = () => {
  it('populates README.md with project name', () => {
    assert.fileContent('README.md', '# ' + cfg.sharedPromptAnswers.projectName)
  })

  it('populates package.json with author', () => {
    assert.JSONFileContent('package.json', {
      author: cfg.sharedPromptAnswers.author
    })
  })
}

const testLegacyPolyfillsExistence = shouldBeThere => {
  const file = 'app/src/client.js'
  const polyfillsToCheck = [
    'if (!Array.from)',
    "import 'matchmedia-polyfill'"
  ]

  if (shouldBeThere) {
    it('adds legacy browser polyfills to frontend js', () => {
      for (const polyfill of polyfillsToCheck) assert.fileContent(file, polyfill)
    })
  } else {
    it('does not add legacy browser polyfills to frontend js', () => {
      for (const polyfill of polyfillsToCheck) assert.noFileContent(file, polyfill)
    })
  }
}

describe('generator-impero', () => {
  describe('bad desc, vue, modern browsers, copy .env', () => {
    const expectedDescription = 'Description... let thy appended double quotes be removed!'

    before(done => {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts(Object.assign(cfg.sharedPromptAnswers, {
          'description': expectedDescription + '"""', // Intentional error: double quotes in JSON
          'jsLang': 'vue',
          'browserSupport': 'modern',
          'copyEnv': true,
          'installDeps': false
        }))
        .on('end', done)
    })

    it('creates appropriate files', () => {
      assert.file(cfg.sharedFiles.concat(cfg.vueFiles).concat(cfg.envFiles))
      assert.noFile(cfg.vanillaJsFiles)
    })

    it('populates package.json and corrects descrption syntax error', () => {
      assert.JSONFileContent('package.json', {
        description: expectedDescription
      })
    })

    testLegacyPolyfillsExistence(false)
    sharedTests()
  })

  describe('sass, vanilla js, legacy browsers, no copy .env', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts(Object.assign(cfg.sharedPromptAnswers, {
          'cssLang': 'sass',
          'jsLang': 'vanilla',
          'browserSupport': 'legacy',
          'copyEnv': false,
          'installDeps': false
        }))
        .on('end', done)
    })

    it('creates appropriate files', () => {
      assert.file(cfg.sharedFiles.concat(cfg.vanillaJsFiles))
      assert.noFile(cfg.vueFiles.concat(cfg.envFiles))
    })

    testLegacyPolyfillsExistence(true)
    sharedTests()
  })
})
