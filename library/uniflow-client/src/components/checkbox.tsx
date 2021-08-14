import React, { Component } from 'react';

let id = 0;
const gen = () => {
  id += 2;

  return `checkbox_${id}`;
};

export default class Checkbox extends Component {
  onChange = (event) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
    const { value } = this.props;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onChange' does not exist on type 'Readon... Remove this comment to see the full error message
    if (this.props.onChange) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onChange' does not exist on type 'Readon... Remove this comment to see the full error message
      this.props.onChange(!value);
    }
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
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
