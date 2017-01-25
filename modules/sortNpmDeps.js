// Pass in an object representation of package.json and this will sort the dependencies alphabetically.
// This is unnecessary but a nice-to-have.

const sortObjectByKeys = require('./sortObjectByKeys')

module.exports = function (manifest) {
  let sortedManifest = Object.assign({}, manifest)

  sortedManifest.dependencies = sortObjectByKeys(manifest.dependencies)
  sortedManifest.devDependencies = sortObjectByKeys(manifest.devDependencies)

  return sortedManifest
}
