import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Checkbox from './checkbox';
import Editor from './editor';
import Select from './select';

export const FormInputType = {
  TEXT: 'TEXT',
  TEXTAREA: 'TEXTAREA',
  EDITOR: 'EDITOR',
  PASSWORD: 'PASSWORD',
  CHECKBOX: 'CHECKBOX',
  SELECT: 'SELECT',
};

const InputGroups = ({ children, icon, groups, errors }) => {
  const errorMessages = errors && errors.map((message, i) => (
    <div key={`error-${i}`} className="invalid-feedback">
      {message}
    </div>
  ))

  return icon || groups.length > 0 ? (
    <div className="input-group">
      {icon && (
        <div className="input-group-text">
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      {groups}
      {children}
      {errorMessages}
    </div>
  ) : (
    <>
        {children}
        {errorMessages}
    </>
  )
}

const FormInput = (props) => {
  const { type, id, label, value, errors, icon, onChange, autoComplete, rows, language, multiple, options } =
    props;

  const placeholder = props.placeholder || label;
  const groups = props.groups ? (Array.isArray(props.groups) ? props.groups : [<React.Fragment key="item">{props.groups}</React.Fragment>]) : [];

  const onChangeInput = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className="row mb-3">
      {label && (
        <label htmlFor="settings-lastname" className="col-sm-2 col-form-label">
          {label}
        </label>
      )}

      <div className={label ? 'col-sm-10' : 'col-sm-12'}>
        <InputGroups icon={icon} groups={groups} errors={errors}>
        {(type === FormInputType.TEXT || type === FormInputType.PASSWORD) && (
          <input
            className={`form-control${errors ? ' is-invalid' : ''}`}
            id={id}
            type={type === FormInputType.PASSWORD ? 'password' : 'text'}
            value={value || ''}
            onChange={onChangeInput}
            placeholder={placeholder}
            autoComplete={autoComplete ? id : undefined}
          />
        )}
        {type === FormInputType.TEXTAREA && (
          <textarea
            className={`form-control${errors ? ' is-invalid' : ''}`}
            id={id}
            value={value || ''}
            onChange={onChangeInput}
            placeholder={placeholder}
            rows={rows}
          />
        )}
        {type === FormInputType.EDITOR && (
          <div className={`form-control-plaintext${errors ? ' is-invalid' : ''}`}>
            <Editor
              id={id}
              value={value || ''}
              onChange={onChange}
              language={language}
              readonly={false}
            />
          </div>
        )}
        {type === FormInputType.CHECKBOX && (
          <Checkbox
            id={id}
            className={`form-control-plaintext${errors ? ' is-invalid' : ''}`}
            value={value}
            onChange={onChange}
          />
        )}
        {type === FormInputType.SELECT && (
          <Select
            id={id}
            value={value}
            onChange={onChange}
            className={`form-control${errors ? ' is-invalid' : ''}`}
            multiple={multiple}
            options={options}
          />
        )}
        </InputGroups>
      </div>
    </div>
  );
};

export default FormInput;
