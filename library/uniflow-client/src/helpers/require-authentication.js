import React from 'react'
import { connect } from 'react-redux'
import { pathTo } from '../routes'
import { isGranted } from '../reducers/user/actions'
import { navigate } from 'gatsby'

export default function requireAuthentication(Component, role = 'ROLE_USER') {
  class requireAuthenticationHelper extends React.Component {
    componentDidMount() {
      this.checkAuth(this.props.isAuthenticated, this.props.user)
    }

    componentDidUpdate(prevProps) {
      this.checkAuth(this.props.isAuthenticated, this.props.user)
    }

    checkAuth = (isAuthenticated, user) => {
      if (!isAuthenticated || (user.uid && !isGranted(user, role))) {
        if (typeof window !== `undefined`) {
          navigate(pathTo('login'))
        }
      }
    }

    render() {
      if (this.props.isAuthenticated === true) {
        return <Component {...this.props} />
      }

      return null
    }
  }

  return connect(state => ({
    token: state.auth.token,
    user: state.user,
    isAuthenticated: state.auth.isAuthenticated,
  }))(requireAuthenticationHelper)
}
