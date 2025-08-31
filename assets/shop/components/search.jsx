import React, { useState } from 'react';
import Select from './select.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle } from '@fortawesome/free-regular-svg-icons';

const Search = (props) => {
  const { programFlows } = props;
  const [search, setSearch] = useState('@uniflow-io/uniflow-flow-function');

  const onSubmit = (event) => {
    event.preventDefault();

    if (props.onPush) {
      props.onPush(search);
    }
  };

  const onChange = (value) => {
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
