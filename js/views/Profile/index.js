import React, {Component} from 'react'
import {getCurrentHistory, getTags} from "../../reducers/history/actions";
import {connect} from "react-redux";
import {getPlatforms} from "../../reducers/flow/actions";

class Profile extends Component {

    generateProfileToken()
    {

    }

    render()
    {
        return (
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Profile
                        <small>Control panel</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard"/> Home</a></li>
                        <li className="active">Profile</li>
                    </ol>
                </section>

                {/* Main content */}
                <section className="content">
                    <div className="row">
                        <div className="col-md-12">

                            <h3>Profile</h3>

                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Profile</h3>
                                </div>
                                <form role="form">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <label htmlFor="profile_token">Api token</label>
                                            <div className="input-group">
                                                <div className="input-group-btn">
                                                    <button type="button" className="btn btn-default"
                                                            onClick={this.generateProfileToken}>Generate
                                                    </button>
                                                </div>
                                                <input type="text" className="form-control" id="profile_token"
                                                       placeholder="You token"/>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </section>
                {/* /.content */}
            </div>
        )
    }
}

export default connect(state => {
    return {
    }
})(Profile)
