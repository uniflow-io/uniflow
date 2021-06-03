import React, { Component } from "react"

let id = 0
const gen = () => {
  id += 2

  return `checkbox_${id}`
}

export default class Checkbox extends Component {
  onChange = (event) => {
    const { value } = this.props

    if (this.props.onChange) {
      this.props.onChange(!value)
    }
  }

  render() {
    const { value, label, className } = this.props
    const uid = gen()
    return (
      <>
        <div className={`custom-control custom-switch d-sm-none${className ? " " + className : ""}`}>
          <input type="checkbox" className="custom-control-input" checked={value} onChange={this.onChange} id={uid} />
          <label className="custom-control-label" htmlFor={uid}>
            {label ? label : ""}
          </label>
        </div>
        <div className={`custom-control d-none d-sm-block custom-checkbox${className ? " " + className : ""}`}>
          <input
            type="checkbox"
            className="custom-control-input"
            checked={value}
            onChange={this.onChange}
            id={uid + 1}
          />
          <label className="custom-control-label" htmlFor={uid + 1}>
            {label ? label : ""}
          </label>
        </div>
      </>
    )
  }
}
