export default function (app) {
  console.log('Hello world!')

  app.on('exampleEmission', () => {
    console.log('Event emitter working.')
  })
}
