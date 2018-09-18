import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    login,
} from '../../reducers/auth/actions'

class Login extends Component {
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

        this.props.dispatch(login(this.state.username, this.state.password)).then(() => {
            console.log(this.props.auth)
        })
    }

    render() {
        const { auth } = this.props
        const { username, password } = this.state

        return (
            <div className="content-wrapper">
                <div className="container-fluid content content-login">

                    <div className="row">
                        <div className="col-sm-6 col-sm-offset-3">
                            <div className="box box-default">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Login</h3>
                                </div>
                                <div className="box-body">

                                    <form>

                                        <div className="form-group col-sm-12">
                                            <input className="form-control" id="username{{ _uid }}" type="text" value={username || ''} onChange={this.onChangeUsername} placeholder="Email or Username" />
                                        </div>

                                        <div className="form-group col-sm-12">
                                            <input className="form-control" id="password{{ _uid }}" type="password" value={password || ''} onChange={this.onChangePassword} placeholder="Password"/>
                                        </div>

                                        <div className="form-group col-sm-12">
                                            <button type="submit"
                                                    className="btn btn-primary btn-block btn-flat"
                                                    disabled={auth.isAuthenticating}
                                                    onClick={this.onSubmit}>Login</button>
                                        </div>

                                        {/*<div class="form-group col-sm-12">
                                            <a href="{{ path('hwi_oauth_service_redirect', {'service': 'facebook' }) }}"
                                            class="btn btn-info btn-block btn-flat">{{'user.login.facebook' | trans}}</a>
                                            </div>*/}

                                        {/*<div class="form-group col-sm-12">
                                            <a href="#" class="btn btn-info btn-block btn-flat">{{'user.login.meetup' | trans}}</a>
                                            </div>*/}

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*<div class="row">
                        <div class="col-sm-6 col-sm-offset-3">
                        <p><a href="{{ path('fos_user_registration_register') }}"><span
                        class="glyphicon glyphicon-log-in register"
                        aria-hidden="true"></span> {{'user.register.new' | trans}}</a></p>
                        </div>
                        </div>*/}

                </div>
            </div>
        )
    }
}

export default connect(state => {
    return {
        auth: state.auth
    }
})(Login)
