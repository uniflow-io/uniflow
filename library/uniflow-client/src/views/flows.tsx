import React, { Component } from 'react';
import { Link } from 'gatsby';
import { connect } from 'react-redux';
import { toFeedPath } from '../reducers/feed/actions';
import { getFlows } from '../reducers/flows/actions';

class Flows extends Component {
  state = {
    page: 1,
    programs: [],
    loadMore: false,
  };

  componentDidMount() {
    this.onFetchFlowsData();
  }

  onFetchFlowsData = () => {
    const { page } = this.state;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    this.props.dispatch(getFlows(page)).then((data) => {
      const programs = this.state.programs.slice().concat(data.data);
      this.setState({ programs, loadMore: programs.length < data.total, page: page + 1 });
    });
  };

  render() {
    const { programs, loadMore } = this.state;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { user } = this.props;

    return (
      <section className="section container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3>Flows</h3>
            <dl className="row">
              {programs.map((program, i) => [
                <dt className="col-md-2 text-md-end fw-normal" key={i * 2}>
                  <Link to={toFeedPath(program, user)}>{program.name}</Link>
                </dt>,
                <dd className="col-md-10" key={i * 2 + 1}>
                  {program.description}
                </dd>,
              ])}
            </dl>
            {loadMore && (
              <div className="row">
                <div className="col-md-12">
                  <div className="d-grid">
                    <button className="btn btn-primary" onClick={this.onFetchFlowsData}>
                      Load more
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default connect((state) => {
  return {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    user: state.user,
  };
})(Flows);
