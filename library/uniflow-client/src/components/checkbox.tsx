import React, { Component } from 'react';

let id = 0;
const gen = () => {
  id += 2;

  return `checkbox_${id}`;
};

export interface CheckboxProps {
  label?: string;
  value: boolean;
  className?: string;
  onChange?: CallableFunction;
}

export default class Checkbox extends Component<CheckboxProps> {
  onChange = () => {
    const { value } = this.props;

    if (this.props.onChange) {
      this.props.onChange(!value);
    }
  };

  render() {
    const { value, label, className } = this.props;
    const uid = gen();
    return (
      <>
        <div className={`form-check form-switch d-sm-none${className ? ' ' + className : ''}`}>
          <input
            type="checkbox"
            className="form-check-input"
            checked={value}
            onChange={this.onChange}
            id={uid}
          />
          <label className="form-check-label" htmlFor={uid}>
            {label ? label : ''}
          </label>
        </div>
        <div className={`form-check d-none d-sm-block${className ? ' ' + className : ''}`}>
          <input
            type="checkbox"
            className="form-check-input"
            checked={value}
            onChange={this.onChange}
            id={uid + 1}
          />
          <label className="form-check-label" htmlFor={uid + 1}>
            {label ? label : ''}
          </label>
        </div>
      </>
    );
  }
}
