import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    register,
} from '../../reducers/auth/actions'
import { withRouter } from 'react-router'
import {pathTo} from '../../routes'
import {commitAddLog} from "../../reducers/log/actions";
import {Log} from '../../models/index'
import {Link} from "react-router-dom";

class Register extends Component {
    state = {
        username: null,
        password: null,
    }

    onChangeUsername = (event) => {
        this.setState({username: event.target.value})
    }

    onChangePassword = (event) => {
        this.setState({password: event.target.value})
    }

    onSubmit = (e) => {
        e.preventDefault()

        this.props.dispatch(register(this.state.username, this.state.password))
            .then(() => {
                if(this.props.auth.isAuthenticated) {
                    this.props.history.push(pathTo('dashboard'))
                } else {
                    return this.props.dispatch(commitAddLog(this.props.auth.statusText, Log.USER_LOGIN_FAIL))
                }
            })
    }

    render() {
        const { auth } = this.props
        const { username, password } = this.state

        return (
            <div className="content-wrapper">

                <section className="content-header">
                    <h1>
                        Register
                        <small>Control panel</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><Link to={pathTo('home')}><i className="fa fa-dashboard"/> Home</Link></li>
                        <li className="active">Register</li>
                    </ol>
                </section>

                <div className="container-fluid content content-register">

                    <div className="row">
                        <div className="col-sm-6 col-sm-offset-3">
                            <div className="box box-default">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Register</h3>
                                </div>
                                <div className="box-body">

                                    <form>

                                        <div className="form-group col-sm-12">
                                            <input className="form-control" id="username{{ _uid }}" type="text" value={username || ''} onChange={this.onChangeUsername} placeholder="Email" />
                                        </div>

                                        <div className="form-group col-sm-12">
                                            <input className="form-control" id="password{{ _uid }}" type="password" value={password || ''} onChange={this.onChangePassword} placeholder="Password"/>
                                        </div>

                                        <div className="form-group col-sm-12">
                                            <button type="submit"
                                                    className="btn btn-primary btn-block btn-flat"
                                                    disabled={auth.isAuthenticating}
                                                    onClick={this.onSubmit}>Register</button>
                                        </div>

                                        {/*<div class="form-group col-sm-12">
                                            <a href="{{ path('hwi_oauth_service_redirect', {'service': 'facebook' }) }}"
                                            class="btn btn-info btn-block btn-flat">{{'user.register.facebook' | trans}}</a>
                                            </div>*/}

                                        {/*<div class="form-group col-sm-12">
                                            <a href="#" class="btn btn-info btn-block btn-flat">{{'user.register.meetup' | trans}}</a>
                                            </div>*/}

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default connect(state => {
    return {
        auth: state.auth
    }
})(withRouter(Register))
