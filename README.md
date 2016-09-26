# generator-impero [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]

## Installation

First, install [Yeoman](http://yeoman.io) and generator-impero using [npm](https://www.npmjs.com/)

```bash
npm i -g yo generator-impero
```

Then generate your new project:

```bash
yo impero
```

## Information

This is a generator providing the following options:

- Sass (incl/ SCSS) / Stylus / Sourdough (coming soon)
- Vanilla JS / React / TypeScript (coming soon)

...based upon a foundation of the following:

- Node / Express on the backend
- Pug templating language
- npm for package management (frontend & backend)
- dotenv for enviromment variables
- Babel transpilation for ES2017, ES2016 & ES2015 down to ES5 and optionally a few useful polyfills (detailed below)

### Legacy Browsers

During setup you will be asked for your targeted browser support. "Modern" is defined as the latest versions of Chrome, Firefox, Edge, and Safari. "Legacy" is defined as IE9+

The following JS polyfills are included in legacy builds:

- Array.from() - no native support in IE, Opera
- String.prototype.includes() - no native support in IE, Opera
- Element.classList - no native support below IE10, and only partial support in IE10 & IE11
- Promise - no native support in IE
- Window.matchMedia() - no native support below IE10

If you select the modern browsers configuration these polyfills will not be included

For now, Babel transpilation down to ES5 will be included in all builds

## Help

If you have any immediate issues, the first port of call is Yeoman Doctor:

```bash
yo doctor
```

Failing that, it's also possible that you'll need to open a new terminal window for Yeoman to pick up on the newly installed generator

[npm-image]: https://badge.fury.io/js/generator-impero.svg
[npm-url]: https://npmjs.org/package/generator-impero
[daviddm-image]: https://david-dm.org/imperodesign/generator-impero.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/imperodesign/generator-impero
