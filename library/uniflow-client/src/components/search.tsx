import React, { Component, SyntheticEvent } from 'react';
import { Select } from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle } from '@fortawesome/free-regular-svg-icons';

export interface SearchProps {
  onPush?: CallableFunction;
}

export default class Search extends Component<SearchProps> {
  state = {
    search: '@uniflow-io/uniflow-flow-javascript',
  };

  onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    if (this.props.onPush) {
      this.props.onPush(this.state.search);
    }
  };

  onChange = (value: string) => {
    this.setState({ search: value });
  };

  render() {
    const { programFlows } = this.props;
    const { search } = this.state;

    return (
      <form className="form-sm-horizontal" onSubmit={this.onSubmit}>
        <div className="row mb-3">
          <label htmlFor="search{{ _uid }}" className="col-sm-2 col-form-label">
            Flow
          </label>
          <div className="col-sm-10">
            <div className="input-group">
              <div className="form-select">
                <Select
                  value={search}
                  onChange={this.onChange}
                  className="form-control pull-right"
                  id="search{{ _uid }}"
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
  }
}
