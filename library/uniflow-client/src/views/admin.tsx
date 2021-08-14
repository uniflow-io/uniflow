import React, { Component } from 'react';
import { fetchConfig, updateConfig } from '../reducers/user/actions';
import { connect } from 'react-redux';

class Admin extends Component {
  state = {
    config: {},
    isSaving: false,
  };

  componentDidMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { auth } = this.props;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    this.props.dispatch(fetchConfig(auth.token, auth.uid)).then((response) => {
      this.setState({
        config: Object.assign({}, this.state.config, response.data),
      });
    });
  }

  onUpdate = (event) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { auth } = this.props;

    if (event) {
      event.preventDefault();
    }

    this.setState({ isSaving: true }, () => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      this.props.dispatch(updateConfig(this.state.config, auth.token, auth.uid)).then(() => {
        this.setState({ isSaving: false });
      });
    });
  };

  render() {
    return (
      <>
        <section className="section container-fluid">
          <h3 className="box-title">Admin</h3>
          <form className="form-sm-horizontal"></form>
        </section>
      </>
    );
  }
}

export default connect((state) => {
  return {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    auth: state.auth,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'env' does not exist on type 'DefaultRoot... Remove this comment to see the full error message
    env: state.env,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    user: state.user,
  };
})(Admin);
