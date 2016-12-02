# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/), and this project will soon adhere to to [Semantic Versioning](http://semver.org/).

## [1.0.0-alpha19] - 2016-12-02
### Added
- Built-in JSON import support. Vue locale files have also been updated to accomodate this.

### Changed
- Correct license discrepancy. For clarification, this project is GNU GPL v3. Generated projects can be whatever you'd like.
- Fix bug whereby Vue generated project would be missing required extension resolvers in `webpack.production.config.js`.
- Fix bug whereby you could add multiple double quotes to your description, each after the first of which then breaking `package.json`.

## [1.0.0-alpha18] - 2016-11-30
### Changed
- Fixed Yeoman npm keyword, allowing it to be indexed.
- Update Webpack config to latest standard.

## [1.0.0-alpha17] - 2016-11-29
### Added
- Opinionated Vue option.
- New env var `DEV_NETWORK`.
- Author prompt for `package.json`.

### Changed
- Rename `assets/` directory to `static/`.
- Rename `main.<stylesheet>` to `index.<stylesheet>`.
- Move content of `scripts/` directory directly into parent directory.

## [1.0.0-alpha16] - 2016-11-28
### Changed
- Update Webpack to latest version.
- Fix another regression.

## [1.0.0-alpha15] - 2016-11-28
### Changed
- Fix various critical regressions.

## [1.0.0-alpha13] - 2016-11-28
### Added
- Changelog.
- Yarn support to both generator and generated projects.
- Validation for project name (against npm) and prevent double quotes from breaking description field in `package.json`.
- ESLint plugin for linting ES2015+ import/export syntax.

### Changed
- Stop transpiling non-standardised/finalised code (es2017 & stage 1).
- Make autoprefixer respect modern/legacy setting choice.
- Fix some issues with ESLint.
- Use Webpack's newer System.import() syntax for dynamic imports.
- Improved default/generated page.
- Make the Nodemon/Webpack bundle bug less likely to occur.
- Update deps.
- Remove cruft.
