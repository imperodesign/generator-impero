import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class App extends Component {
  render () {
    return (
      <h1>Hello, world!</h1>
    )
  }
}

export default function () {
  ReactDOM.render(<App />, document.querySelector('.page-home'))
}
