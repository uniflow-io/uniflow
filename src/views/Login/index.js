import React, {Component} from 'react'
import request from 'axios'
import server from '../../utils/server'

class Login extends Component {
    onSubmit = (e) => {
        e.preventDefault()

        const data = new FormData(e.target);

        return request
            .post(server.getBaseUrl() + '/login-check', data)
            .then((response) => {
                console.log(response)
            });
    }

    render() {
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

                                    <form onSubmit={this.onSubmit}>

                                        {/*<input type="hidden" name="_csrf_token" value="{{ csrf_token }}"/> */}
                                        <input type="hidden" id="remember_me" name="_remember_me" value="on"/>

                                        <div className="form-group col-sm-12">
                                            <input className="form-control" id="username" name="_username"
                                                   placeholder="Email or Username" required="required"/>
                                        </div>

                                        <div className="form-group col-sm-12">
                                            <input type="password" className="form-control" id="password"
                                                   name="_password"
                                                   required="required" placeholder="Password"/>
                                        </div>

                                        <div className="form-group col-sm-12">
                                            <button type="submit"
                                                    className="btn btn-primary btn-block btn-flat">Login
                                            </button>
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

export default Login
