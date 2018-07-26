import React, {Component} from 'react'
import _ from 'lodash'
import {
    updateProfile,
    commitUpdateProfile
} from '../../reducers/user/actions'
import {connect} from "react-redux";

function copyTextToClipboard(text) {
    let textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
    } catch (err) {
    }

    document.body.removeChild(textArea);
}

class Profile extends Component {
    onUpdateApiKey = (event) => {
        this.props
            .dispatch(commitUpdateProfile({...this.props.user, ...{apiKey: event.target.value}}))
            .then(() => {
                this.onUpdate()
            })
    }

    onCopyApiUsage = (event) => {
        const {clipbard} = this.props;

        copyTextToClipboard(clipbard)
    }

    onUpdate = _.debounce(() => {
        this.props.dispatch(updateProfile(this.props.user))
    }, 500)

    generateKey = () => {
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let apiKey = "";
        for (let i = 0; i < 32; i++)
            apiKey += chars.charAt(Math.floor(Math.random() * chars.length));

        this.props
            .dispatch(commitUpdateProfile({...this.props.user, ...{apiKey: apiKey}}))
            .then(() => {
                this.onUpdate()
            })
    }

    render() {
        const {user, clipbard} = this.props;

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
                                            <label htmlFor="profile_key">Api key</label>
                                            <div className="input-group">
                                                <div className="input-group-btn">
                                                    <button type="button" className="btn btn-default"
                                                            onClick={this.generateKey}>Generate
                                                    </button>
                                                </div>
                                                <input type="text" className="form-control" id="profile_key"
                                                       value={user.apiKey || ''} onChange={this.onUpdateApiKey}
                                                       placeholder="api key"/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="profile_key">Api usage</label>
                                            <div className="input-group">
                                                <div className="input-group-btn">
                                                    <button type="button" className="btn btn-default"
                                                            onClick={this.onCopyApiUsage}><i className="fa fa-clipboard" />
                                                    </button>
                                                </div>
                                                <input type="text" className="form-control" id="profile_key"
                                                       value={clipbard || ''}
                                                       readOnly={true}
                                                       placeholder="api key"/>
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

const getClipboard = (user) => {
    if(user.apiKey) {
        return 'curl -s -o- https://uniflow.io/dist/js/bash.js | node - --api-key=' + user.apiKey
    }

    return null
}

export default connect(state => {
    return {
        user: state.user,
        clipbard: getClipboard(state.user)
    }
})(Profile)
