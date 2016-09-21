// Pass in an object (package.json) and this will sort the dependencies alphabetically
// This is absolutely not needed but a nice-to-have :-)

module.exports = function (deps) {
  let sortedDeps = {}
  let sortedDevDeps = {}

  Object.keys(deps.dependencies).sort().forEach(key => {
    sortedDeps[key] = deps.dependencies[key]
  })

  Object.keys(deps.devDependencies).sort().forEach(key => {
    sortedDevDeps[key] = deps.devDependencies[key]
  })

  deps.dependencies = sortedDeps
  deps.devDependencies = sortedDevDeps

  return deps
}
