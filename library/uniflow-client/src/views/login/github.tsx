import React, { Component } from 'react';
import { navigate } from 'gatsby';
import { pathTo } from '../../routes';
import { githubLogin } from '../../reducers/auth/actions';
import { commitAddLog } from '../../reducers/logs/actions';
import { connect } from 'react-redux';

class GithubLogin extends Component {
  async componentDidMount() {
    const code = this.getCode();
    if (code === null) {
      if (typeof window !== `undefined`) {
        return navigate(pathTo('login'));
      }
    }

    await this.props.dispatch(githubLogin(code, this.props.auth.token))
    if (this.props.auth.isAuthenticated) {
      if (typeof window !== `undefined`) {
        return navigate(pathTo('feed'));
      }
    } else {
      this.props.dispatch(commitAddLog(this.props.auth.statusText));
      if (typeof window !== `undefined`) {
        return navigate(pathTo('login'));
      }
    }
  }

  getCode() {
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
    auth: state.auth,
  };
})(GithubLogin);
