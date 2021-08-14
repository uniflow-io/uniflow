import React, { Component } from 'react';
import { navigate } from 'gatsby';
import { pathTo } from '../../routes';
import { githubLogin } from '../../reducers/auth/actions';
import { commitAddLog } from '../../reducers/logs/actions';
import { connect } from 'react-redux';

class GithubLogin extends Component {
  componentDidMount() {
    const code = this.getCode();
    if (code === null) {
      if (typeof window !== `undefined`) {
        return navigate(pathTo('login'));
      }
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    this.props.dispatch(githubLogin(code, this.props.auth.token)).then(() => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type 'Readonly<{... Remove this comment to see the full error message
      if (this.props.auth.isAuthenticated) {
        if (typeof window !== `undefined`) {
          return navigate(pathTo('feed'));
        }
      } else {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        this.props.dispatch(commitAddLog(this.props.auth.statusText));
        if (typeof window !== `undefined`) {
          return navigate(pathTo('login'));
        }
      }
    });
  }

  getCode() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'location' does not exist on type 'Readon... Remove this comment to see the full error message
    const m = this.props.location.search.match(/code=([^&]+)/);
    if (m) {
      return m[1];
    }

    return null;
  }

  render() {
    return (
      <section className="section container-fluid">
        <h3 className="box-title">Login Github</h3>
        <p className="text-center">Application is currently logging you from Github</p>
      </section>
    );
  }
}

export default connect((state) => {
  return {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    auth: state.auth,
  };
})(GithubLogin);
