import React from 'react';
import {connect} from 'react-redux';
import {pathTo} from '../../routes'
import { withRouter } from 'react-router'

export default function requireAuthentication(Component) {

    class AuthenticatedComponent extends React.Component {

        componentWillMount () {
            this.checkAuth(this.props.isAuthenticated);
        }

        componentWillReceiveProps (nextProps) {
            this.checkAuth(nextProps.isAuthenticated);
        }

        checkAuth (isAuthenticated) {
            if (!isAuthenticated) {
                this.props.history.push(pathTo('login'))
            }
        }

        render () {
            return (
                <div>
                    {this.props.isAuthenticated === true
                        ? <Component {...this.props}/>
                        : null
                    }
                </div>
            )

        }
    }

    return connect((state) => ({
        token: state.auth.token,
        isAuthenticated: state.auth.isAuthenticated
    }))(withRouter(AuthenticatedComponent));
}
