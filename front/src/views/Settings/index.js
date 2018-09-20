import React, {Component} from 'react'
import _ from 'lodash'
import {
    updateSettings,
    commitUpdateSettings
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

class Settings extends Component {
    onUpdateApiKey = (event) => {
        this.props
            .dispatch(commitUpdateSettings({...this.props.user, ...{apiKey: event.target.value}}))
            .then(() => {
                this.onUpdate()
            })
    }

    onCopyApiUsage = (event) => {
        const {clipbard} = this.props;

        copyTextToClipboard(clipbard)
    }

    onUpdate = _.debounce(() => {
        this.props.dispatch(updateSettings(this.props.user, this.props.auth.token))
    }, 500)

    generateKey = () => {
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let apiKey = "";
        for (let i = 0; i < 32; i++)
            apiKey += chars.charAt(Math.floor(Math.random() * chars.length));

        this.props
            .dispatch(commitUpdateSettings({...this.props.user, ...{apiKey: apiKey}}))
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
                        Settings
                        <small>Control panel</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard"/> Home</a></li>
                        <li className="active">Settings</li>
                    </ol>
                </section>

                {/* Main content */}
                <section className="content">
                    <div className="row">
                        <div className="col-md-12">

                            <h3>Settings</h3>

                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Settings</h3>
                                </div>
                                <form role="form">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <label htmlFor="settings_key">Api key</label>
                                            <div className="input-group">
                                                <div className="input-group-btn">
                                                    <button type="button" className="btn btn-default"
                                                            onClick={this.generateKey}>Generate
                                                    </button>
                                                </div>
                                                <input type="text" className="form-control" id="settings_key"
                                                       value={user.apiKey || ''} onChange={this.onUpdateApiKey}
                                                       placeholder="api key"/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="settings_key">Api usage</label>
                                            <div className="input-group">
                                                <div className="input-group-btn">
                                                    <button type="button" className="btn btn-default"
                                                            onClick={this.onCopyApiUsage}><i className="fa fa-clipboard" />
                                                    </button>
                                                </div>
                                                <input type="text" className="form-control" id="settings_key"
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
        return 'node -e "$(curl -s https://uniflow.io/dist/js/bash.js)" - --api-key=' + user.apiKey
    }

    return null
}

export default connect(state => {
    return {
        auth: state.auth,
        user: state.user,
        clipbard: getClipboard(state.user)
    }
})(Settings)
