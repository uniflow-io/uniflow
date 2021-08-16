import React, { Component } from 'react';
import { Link } from 'gatsby';
import { connect } from 'react-redux';
import { Remarkable } from 'remarkable';
import { toFeedPath } from '../reducers/feed/actions';
import { getFlows } from '../reducers/flows/actions';

class Flows extends Component {
  state = {
    page: 1,
    programs: [],
    loadMore: false,
  };
  md: Remarkable;

  constructor(props) {
    super(props)
    this.md = new Remarkable()
  }

  componentDidMount() {
    this.onFetchFlowsData();
  }

  onFetchFlowsData = async () => {
    const { page } = this.state;
    const data = await this.props.dispatch(getFlows(page))
    const programs = this.state.programs.slice().concat(data.data);
    this.setState({ programs, loadMore: programs.length < data.total, page: page + 1 });
  };

  render() {
    const { programs, loadMore } = this.state;
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
                <dd
                  className="col-md-10"
                  key={i * 2 + 1}
                  dangerouslySetInnerHTML={{__html: this.md.render(program.description)}}>
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
    user: state.user,
  };
})(Flows);
