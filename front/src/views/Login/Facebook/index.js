import React, {Component} from 'react'
import {Link} from "react-router-dom";
import {pathTo} from "../../../routes";

class LoginFacebook extends Component {
    componentWillMount () {
    }

    render () {
        return (
            <div className="content-wrapper">

                <section className="content-header">
                    <h1>
                        Login Facebook
                        <small>Control panel</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><Link to={pathTo('home')}><i className="fa fa-dashboard"/> Home</Link></li>
                        <li className="active">Login</li>
                    </ol>
                </section>

                <div className="container-fluid content content-login">

                    <div className="row">
                        <div className="col-sm-6 col-sm-offset-3">
                            <div className="box box-default">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Login Facebook</h3>
                                </div>
                                <div className="box-body">
                                    <p>Application is currently logging you from facebook</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )

    }
}

export default LoginFacebook
