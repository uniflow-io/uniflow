import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Checkbox from './checkbox';

export enum FormInputType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  PASSWORD = 'PASSWORD',
  CHECKBOX = 'CHECKBOX',
}

export interface FormInputProps {
  type: FormInputType
  id: string
  label?: string
  placeholder?: string
  value?: any
  errors?: string[]
  icon?: IconDefinition
  groups?: React.ReactNode | React.ReactNodeArray
  onChange?: (value: any) => void
  autoComplete?: boolean
  rows?: number
}

function FormInput(props: FormInputProps) {
  const {type, id, label, value, errors, icon, onChange, autoComplete, rows } = props
  const placeholder = props.placeholder || label
  const groups = props.groups ? (Array.isArray(props.groups) ? props.groups : [props.groups]) : []

  const onChangeInput: React.ChangeEventHandler<HTMLInputElement|HTMLTextAreaElement> = (event) => {
    if(onChange) {
      onChange(event.target.value)
    }
  }

  return (
    <div className="row mb-3">
      {label && (
      <label htmlFor="settings-lastname" className="col-sm-2 col-form-label">{label}</label>
      )}

      <div className={label ? ' col-sm-10' : 'col-sm-12'}>
        <div className="input-group">
          {(icon && (
          <div className="input-group-text">
            <FontAwesomeIcon icon={icon} />
          </div>
          ))}
          {groups}
          {(type === FormInputType.TEXT || type === FormInputType.PASSWORD) && (
          <input
            className={`form-control${errors ? ' is-invalid' : ''}`}
            id={id}
            type={type === FormInputType.PASSWORD ? 'password' : 'text'}
            value={value || ''}
            onChange={onChangeInput}
            placeholder={placeholder}
            autoComplete={autoComplete?id:undefined}
          />
          )}
          {(type === FormInputType.TEXTAREA) && (
          <textarea
            className={`form-control${errors ? ' is-invalid' : ''}`}
            id={id}
            value={value || ''}
            onChange={onChangeInput}
            placeholder={placeholder}
            rows={rows}
          />
          )}
          {(type === FormInputType.CHECKBOX) && (
            <Checkbox
              className="form-control-plaintext"
              value={value}
              onChange={onChange}
              id="settins-optinNewsletter"
              />
          )}
          {errors && errors.map((message, i) => (
            <div
              key={`error-${i}`}
              className="invalid-feedback"
            >
              {message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FormInput