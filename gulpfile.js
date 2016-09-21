'use strict'

const path = require('path')
const gulp = require('gulp')
const nsp = require('gulp-nsp')

gulp.task('nsp', function (cb) {
  nsp({package: path.resolve('package.json')}, cb)
})

gulp.task('prepublish', ['nsp'])
