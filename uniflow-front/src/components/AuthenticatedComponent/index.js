import React from 'react'
import { connect } from 'react-redux'
import { pathTo } from '../../routes'
import { isGranted } from '../../reducers/user/actions'
import { navigate } from 'gatsby'

export default function requireAuthentication(Component, role = 'ROLE_USER') {
  class AuthenticatedComponent extends React.Component {
    componentDidMount() {
      this.checkAuth(this.props.isAuthenticated, this.props.user)
    }

    componentDidUpdate(prevProps) {
      this.checkAuth(this.props.isAuthenticated, this.props.user)
    }

    checkAuth = (isAuthenticated, user) => {
      if (!isAuthenticated || (user.username && !isGranted(user, role))) {
        if (typeof window !== `undefined`) {
          navigate(pathTo('login'))
        }
      }
    }

    render() {
      return (
        <div>
          {this.props.isAuthenticated === true ? (
            <Component {...this.props} />
          ) : (
            ''
          )}
        </div>
      )
    }
  }

  return connect(state => ({
    token: state.auth.token,
    user: state.user,
    isAuthenticated: state.auth.isAuthenticated,
  }))(AuthenticatedComponent)
}
