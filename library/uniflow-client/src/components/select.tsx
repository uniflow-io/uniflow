import React, { FC } from 'react';
import { default as ReactSelect } from 'react-select';
import { default as ReactCreatableSelect } from 'react-select/creatable';
import { useApp } from '../contexts/app';

export interface SelectProps {
  value: string;
  onChange?: (value: any) => void;
  className: string;
  id: string;
  multiple?: boolean;
  options: { value: string, label: string }[];
  edit?: boolean;
}

const Select: FC<SelectProps> = (props) => {
  const { value, options, edit, multiple } = props;
  const app = useApp();
  const customStyles = {
    light: {
      menu: (provided) => ({
        ...provided,
        zIndex: 10,
      }),
      multiValue: (styles) => ({
        ...styles,
        backgroundColor: '#6c757d',
      }),
      multiValueLabel: (styles) => ({
        ...styles,
        color: '#FFFFFF',
      }),
    },
    dark: {
      menu: (provided) => ({
        ...provided,
        zIndex: 10,
      }),
      multiValue: (styles) => ({
        ...styles,
        backgroundColor: '#576068',
      }),
      multiValueLabel: (styles) => ({
        ...styles,
        color: '#ebf4f1',
      }),
    },
    sepia: {
      menu: (provided) => ({
        ...provided,
        zIndex: 10,
      }),
      multiValue: (styles) => ({
        ...styles,
        backgroundColor: '#876944',
      }),
      multiValueLabel: (styles) => ({
        ...styles,
        color: '#eadec2',
      }),
    },
  };
  const themes = {
    light: (theme) => theme,
    dark: (theme) => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary25: '#0056b3',
        neutral0: '#0e2233',
        neutral5: '#0f2b3d',
        neutral10: '#576068',
        neutral20: '#002651',
        neutral70: '#002651',
        neutral80: '#495057',
        dangerLight: '#d59b8b',
      },
    }),
    sepia: (theme) => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary25: '#0056b3',
        neutral0: '#eadec2',
        neutral5: '#0f2b3d',
        neutral10: '#876944',
        neutral20: '#ded0bf',
        neutral70: '#002651',
        neutral80: '#495057',
        dangerLight: '#d59b8b',
      },
    }),
  };

  const selectOptions = options || [];
  let selectValue = undefined;

  if (multiple === true) {
    selectValue = [];
    if (value) {
      selectValue = value.map((data) => {
        return { value: data, label: data };
      });
    }
  } else {
    selectValue = selectOptions.filter((option) => {
      return option.value === value;
    });
  }

  const DisplaySelect = edit === true ? ReactCreatableSelect : ReactSelect;

  return (
    <DisplaySelect
      isMulti={multiple === true}
      value={selectValue}
      onChange={(data) => {
        const { onChange, multiple } = props;
        if (onChange) {
          if (multiple === true) {
            onChange(
              (data || []).map((option) => {
                return option.value;
              })
            );
          } else {
            onChange(data.value);
          }
        }
      }}
      options={selectOptions}
      styles={customStyles[app.theme]}
      theme={themes[app.theme]}
    />
  );
}

export default Select;
