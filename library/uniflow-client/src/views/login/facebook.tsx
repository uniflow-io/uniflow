import React, { Component } from 'react';
import { navigate } from 'gatsby';
import { pathTo } from '../../routes';
import { facebookLogin } from '../../reducers/auth/actions';
import { commitAddLog } from '../../reducers/logs/actions';
import { connect } from 'react-redux';

class FacebookLogin extends Component {
  componentDidMount() {
    const accessToken = this.getAccessToken();
    if (accessToken === null) {
      if (typeof window !== `undefined`) {
        return navigate(pathTo('login'));
      }
    }

    this.props.dispatch(facebookLogin(accessToken, this.props.auth.token)).then(() => {
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
    });
  }

  getAccessToken() {
    const m = this.props.location.hash.match(/access_token=([^&]+)/);
    if (m) {
      return m[1];
    }

    return null;
  }

  render() {
    return (
      <section className="section container-fluid">
        <h3 className="box-title">Login Facebook</h3>
        <p className="text-center">Application is currently logging you from Facebook</p>
      </section>
    );
  }
}

export default connect((state) => {
  return {
    auth: state.auth,
  };
})(FacebookLogin);
