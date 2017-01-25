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
      polyfillsToCheck.map(polyfill => { assert.fileContent(file, polyfill) })
    })
  } else {
    it('does not add legacy browser polyfills to frontend js', () => {
      polyfillsToCheck.map(polyfill => { assert.noFileContent(file, polyfill) })
    })
  }
}

describe('generator-impero', () => {
  describe('bad desc, vue, modern browsers, copy .env', () => {
    const expectedDescription = 'Description... let thy appended double quotes be removed!'

    before(done => {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts(Object.assign(cfg.sharedPromptAnswers, {
          description: expectedDescription + '"""', // Intentional error: double quotes in JSON
          jsLang: 'vue',
          browserSupport: 'modern',
          copyEnv: true,
          installDeps: false
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
          cssLang: 'sass',
          jsLang: 'vanilla',
          browserSupport: 'legacy',
          copyEnv: false,
          installDeps: false
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

describe('modules', () => {
  describe('shortLoaderNotation', () => {
    const shortLoaderNotation = require('../modules/shortLoaderNotation')

    it('removes "-loader" suffix from string', () => {
      assert.equal('babel', shortLoaderNotation('babel-loader'))
    })
  })

  describe('sortObjectByKeys', () => {
    const sortObjectByKeys = require('../modules/sortObjectByKeys')

    it('sorts object alphabetically by keys', () => {
      const sortedObj = { a: 1, b: 3, c: 2 }
      const unsortedObj = { a: 1, c: 2, b: 3 }

      assert.equal(Object.keys(sortedObj)[0], Object.keys(sortObjectByKeys(unsortedObj))[0])
      assert.equal(Object.keys(sortedObj)[1], Object.keys(sortObjectByKeys(unsortedObj))[1])
      assert.equal(Object.keys(sortedObj)[2], Object.keys(sortObjectByKeys(unsortedObj))[2])
    })
  })

  describe('sortNpmDeps', () => {
    const sortNpmDeps = require('../modules/sortNpmDeps')

    it('sorts package.json dependencies alphabetically by keys', () => {
      const sortedManifest = {
        name: 'random',
        dependencies: { 'else': '2.2.2', 'something': '0.0.1' },
        devDependencies: { 'also': '0.0.1', 'this': '2.2.2' }
      }
      const unsortedManifest = {
        name: 'random',
        dependencies: { 'something': '0.0.1', 'else': '2.2.2' },
        devDependencies: { 'also': '0.0.1', 'this': '2.2.2' }
      }

      assert.equal(Object.keys(sortedManifest.dependencies)[0], Object.keys(sortNpmDeps(unsortedManifest).dependencies)[0])
      assert.equal(Object.keys(sortedManifest.devDependencies)[0], Object.keys(sortNpmDeps(unsortedManifest).devDependencies)[0])
    })
  })
})
