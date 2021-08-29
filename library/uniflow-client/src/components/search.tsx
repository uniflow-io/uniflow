import React, { useState, SyntheticEvent } from 'react';
import { Select } from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle } from '@fortawesome/free-regular-svg-icons';
import { FC } from 'react';

export interface SearchProps {
  onPush?: CallableFunction;
  programFlows: { key: string; label: string }[]
}

const Search: FC<SearchProps> = (props) => {
  const { programFlows } = props;
  const [search, setSearch] = useState<string>('@uniflow-io/uniflow-flow-function');

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (props.onPush) {
      props.onPush(search);
    }
  };

  const onChange = (value: string) => {
    setSearch(value);
  };

  return (
    <form className="form-sm-horizontal" onSubmit={onSubmit}>
      <div className="row mb-3">
        <label htmlFor="search" className="col-sm-2 col-form-label">
          Flow
        </label>
        <div className="col-sm-10">
          <div className="input-group">
            <div className="form-select">
              <Select
                value={search}
                onChange={onChange}
                className="form-control pull-right"
                id="search"
                options={programFlows.map((flow) => {
                  return { value: flow.key, label: flow.label };
                })}
              />
            </div>
            <button type="submit" className="input-group-text">
              <FontAwesomeIcon icon={faDotCircle} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Search;
