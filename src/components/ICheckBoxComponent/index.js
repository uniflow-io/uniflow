import React, { Component } from 'react'

let id = 0
const gen = () => {
  id++

  return `checkbox_${ id }`
}

export default class ICheckBoxComponent extends Component {
  onChange = event => {
    const {
      value
    } = this.props

    if (this.props.onChange) {
      this.props.onChange(!value)
    }
  }

  render () {
    const {
      value
    } = this.props
    const uid = gen()

    return (
      <div className="icheck-primary">
        <input type="checkbox" defaultChecked={value} onChange={this.onChange} id={uid}/>
        <label htmlFor={uid} />
      </div>
    )
  }
}
