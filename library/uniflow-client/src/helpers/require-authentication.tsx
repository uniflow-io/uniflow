import React from 'react';
import { connect } from 'react-redux';
import { pathTo } from '../routes';
import { isGranted } from '../reducers/user/actions';
import { navigate } from 'gatsby';

export default function requireAuthentication(Component, role = 'ROLE_USER') {
  class requireAuthenticationHelper extends React.Component {
    componentDidMount() {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'isAuthenticated' does not exist on type ... Remove this comment to see the full error message
      this.checkAuth(this.props.isAuthenticated, this.props.user);
    }

    componentDidUpdate(prevProps) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'isAuthenticated' does not exist on type ... Remove this comment to see the full error message
      this.checkAuth(this.props.isAuthenticated, this.props.user);
    }

    checkAuth = (isAuthenticated, user) => {
      if (!isAuthenticated || (user.uid && !isGranted(user, role))) {
        if (typeof window !== `undefined`) {
          navigate(pathTo('login'));
        }
      }
    };

    render() {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'isAuthenticated' does not exist on type ... Remove this comment to see the full error message
      if (this.props.isAuthenticated === true) {
        return <Component {...this.props} />;
      }

      return null;
    }
  }

  return connect((state) => ({
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    token: state.auth.token,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    user: state.user,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    isAuthenticated: state.auth.isAuthenticated,
  }))(requireAuthenticationHelper);
}
