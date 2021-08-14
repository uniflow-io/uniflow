import React, { Component } from 'react';
import { Select } from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle } from '@fortawesome/free-regular-svg-icons';

export default class Search extends Component {
  state = {
    search: '@uniflow-io/uniflow-flow-javascript',
  };

  onSubmit = (event) => {
    event.preventDefault();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onPush' does not exist on type 'Readonly... Remove this comment to see the full error message
    if (this.props.onPush) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onPush' does not exist on type 'Readonly... Remove this comment to see the full error message
      this.props.onPush(this.state.search);
    }
  };

  onChange = (value) => {
    this.setState({ search: value });
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'programFlows' does not exist on type 'Re... Remove this comment to see the full error message
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
                  // @ts-expect-error ts-migrate(2322) FIXME: Type '{ value: string; onChange: (value: any) => v... Remove this comment to see the full error message
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
