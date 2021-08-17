import React from 'react';

let uniqueId = 0;
const gen = () => {
  uniqueId += 2;

  return `checkbox_${uniqueId}`;
};

export interface CheckboxProps {
  label?: string;
  value: boolean;
  className?: string;
  onChange?: (value: boolean) => void;
  id?: string
}

function Checkbox(props: CheckboxProps) {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = () => {
    const { value } = props;

    if (props.onChange) {
      props.onChange(!value);
    }
  };

  const { value, label, className, id } = props;
  const uid = id ?? gen();
  return (
    <>
      <div className={`form-check form-switch d-sm-none${className ? ' ' + className : ''}`}>
        <input
          type="checkbox"
          className="form-check-input"
          checked={value}
          onChange={onChange}
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
          onChange={onChange}
          id={uid + 1}
        />
        <label className="form-check-label" htmlFor={uid + 1}>
          {label ? label : ''}
        </label>
      </div>
    </>
  );
}

export default Checkbox