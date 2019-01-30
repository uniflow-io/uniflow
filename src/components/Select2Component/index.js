import React, { Component } from 'react'
import Select from 'react-select'

export default class Select2Component extends Component {
  onChange = option => {
    if (this.props.onChange) {
      this.props.onChange(option.value)
    }
  }

  render () {
    const { value, options } = this.props
    const customStyles = {
      menu: (provided, state) => ({
        ...provided,
        zIndex: 10
      }),
    }

    let opts = options || []

    let selected = opts.filter(option => {
      return option.value === value
    })

    return (
      <Select
        value={selected.length > 0 ? selected[0] : null}
        onChange={this.onChange}
        options={opts}
        styles={customStyles}
      />
    )
  }
}
