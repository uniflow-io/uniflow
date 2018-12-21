import React, { Component } from 'react'
import { Select2Component } from '../../components'
import { Bus } from '../../models'
import io from 'socket.io-client';
import { Browser } from 'remote-browser/web-client';

type Props = {
    bus: Bus
}

export default class ComponentBrowser extends Component<Props> {
    state = {
        running: false,
        variable: null,
        host: null,
        ioPort: null,
        proxyPort: null,
        mode: null,
        displayBrowserConnect: false
    }

    static tags() {
        return ['core']
    }

    static clients() {
        return ['uniflow']
    }

    constructor(props) {
        super(props)

        this.resolveBrowserConnected = null
    }

    componentDidMount() {
        const { bus } = this.props

        bus.on('reset', this.deserialise);
        bus.on('compile', this.onCompile);
        bus.on('execute', this.onExecute);
    }

    componentWillUnmount() {
        const { bus } = this.props

        bus.off('reset', this.deserialise);
        bus.off('compile', this.onCompile);
        bus.off('execute', this.onExecute);
    }

    componentWillReceiveProps(nextProps) {
        const oldProps = this.props;

        if(nextProps.bus !== oldProps.bus) {
            oldProps.bus.off('reset', this.deserialise);
            oldProps.bus.off('compile', this.onCompile);
            oldProps.bus.off('execute', this.onExecute);

            nextProps.bus.on('reset', this.deserialise);
            nextProps.bus.on('compile', this.onCompile);
            nextProps.bus.on('execute', this.onExecute);
        }
    }

    serialise = () => {
        return [this.state.variable, this.state.host, this.state.ioPort, this.state.proxyPort, this.state.mode]
    }

    deserialise = (data) => {
        let [variable, host, ioPort, proxyPort, mode] = data ? data : [null, null, null, null, null];

        this.setState({variable: variable, host: host, ioPort: ioPort, proxyPort: proxyPort, mode: mode})
    }

    onChangeVariable = (event) => {
        this.setState({variable: event.target.value}, this.onUpdate)
    }

    onChangeHost = (event) => {
        this.setState({host: event.target.value}, this.onUpdate)
    }

    onChangeIOPort = (event) => {
        this.setState({ioPort: event.target.value}, this.onUpdate)
    }

    onChangeProxyPort = (event) => {
        this.setState({proxyPort: event.target.value}, this.onUpdate)
    }

    onChangeMode = (mode) => {
        this.setState({mode: mode}, this.onUpdate)
    }

    onBrowserConnected = (event) => {
        event.preventDefault()

        if(this.resolveBrowserConnected) {
            this.resolveBrowserConnected()
        }
    }

    onUpdate = () => {
        this.props.onUpdate(this.serialise())
    }

    onDelete = (event) => {
        event.preventDefault()

        this.props.onPop()
    }

    onCompile = (interpreter, scope, asyncWrapper) => {
        let obj = {};

        let constructorWrapper  = function (host, ioPort, proxyPort, mode) {
            let newBrowser  = interpreter.createObjectProto(obj.BROWSER_PROTO),
                socket = io('https://' + host + ':' + ioPort),
                wrapper,
                browser = new Browser();

            wrapper = function (callback) {
                let args     = ['browser.connect', proxyPort, mode];

                return new Promise((resolve) => {
                    args.push(function (data) {
                        browser.connectionUrl = 'ws://' + host + ':' + proxyPort
                        browser.sessionId = 'default'
                        browser.negotiateConnection()
                            .then(() => {
                                callback(interpreter.nativeToPseudo(data));
                                resolve();
                            })
                    });
                    socket.emit.apply(socket, args);
                })
            };
            interpreter.setProperty(newBrowser, 'connect', interpreter.createAsyncFunction(asyncWrapper(wrapper)));

            wrapper = function (asyncFunction, args, callback) {
                asyncFunction = interpreter.pseudoToNative(asyncFunction)
                args = interpreter.pseudoToNative(args)
                return browser.evaluateInBackground(asyncFunction, args)
                    .then((result) => {
                        callback(interpreter.nativeToPseudo(result));
                    })
            };
            interpreter.setProperty(newBrowser, 'evaluateInBackground', interpreter.createAsyncFunction(asyncWrapper(wrapper)));

            wrapper = function (tabId, asyncFunction, args, callback) {
                tabId = interpreter.pseudoToNative(tabId)
                asyncFunction = interpreter.pseudoToNative(asyncFunction)
                args = interpreter.pseudoToNative(args)
                return browser.evaluateInContent(tabId, asyncFunction, args)
                    .then((result) => {
                        callback(interpreter.nativeToPseudo(result));
                    })
            };
            interpreter.setProperty(newBrowser, 'evaluateInContent', interpreter.createAsyncFunction(asyncWrapper(wrapper)));

            return newBrowser;
        };
        obj.Browser       = interpreter.createNativeFunction(constructorWrapper, true);
        obj.BROWSER_PROTO = interpreter.getProperty(obj.Browser, 'prototype');
        interpreter.setProperty(scope, 'Browser', obj.Browser);
    }

    onExecute = (runner) => {
        return Promise
            .resolve()
            .then(() => {
                return new Promise((resolve) => {
                    this.setState({running: true}, resolve);
                })
            }).then(() => {
                return runner.eval('var ' + this.state.variable + ' = new Browser(\'' + this.state.host + '\', \'' + this.state.ioPort + '\', \''+ this.state.proxyPort +'\', \''+ this.state.mode +'\')')
                    .then(() => {
                        return runner.eval(this.state.variable + '.connect()')
                    })
                    .then(() => {
                        return new Promise((resolve) => {
                            this.setState({displayBrowserConnect: true}, resolve);
                        });
                    })
                    .then(() => {
                        return new Promise((resolve) => {
                            this.resolveBrowserConnected = resolve
                        })
                    })
                    .then(() => {
                        return new Promise((resolve) => {
                            this.setState({displayBrowserConnect: false}, resolve);
                        });
                    })
            })
            .then(() => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                })
            })
            .then(() => {
                return new Promise((resolve) => {
                    this.setState({running: false}, resolve);
                })
            })
    }

    render() {
        const { running, variable, host, ioPort, proxyPort, mode } = this.state

        return (
            <div className="box box-info">
                <form className="form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title"><button type="submit" className="btn btn-default">{running ? <i className="fa fa-refresh fa-spin" /> : <i className="fa fa-refresh fa-cog" />}</button> Browser</h3>
                        <div className="box-tools pull-right">
                            <a className="btn btn-box-tool" onClick={this.onDelete}><i className="fa fa-times" /></a>
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="form-group">
                            <label htmlFor="variable{{ _uid }}" className="col-sm-2 control-label">Variable</label>

                            <div className="col-sm-10">
                                <input id="variable{{ _uid }}" type="text" value={variable || ''} onChange={this.onChangeVariable} className="form-control"/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="host{{ _uid }}" className="col-sm-2 control-label">Host</label>

                            <div className="col-sm-10">
                                <input id="host{{ _uid }}" type="text" value={host || ''} onChange={this.onChangeHost} className="form-control"/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="ioPort{{ _uid }}" className="col-sm-2 control-label">IO Port</label>

                            <div className="col-sm-10">
                                <input id="ioPort{{ _uid }}" type="text" value={ioPort || ''} onChange={this.onChangeIOPort} className="form-control"/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="proxyPort{{ _uid }}" className="col-sm-2 control-label">Proxy Port</label>

                            <div className="col-sm-10">
                                <input id="proxyPort{{ _uid }}" type="text" value={proxyPort || ''} onChange={this.onChangeProxyPort} className="form-control"/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="mode{{ _uid }}" className="col-sm-2 control-label">Mode</label>

                            <div className="col-sm-10">
                                <Select2Component value={mode || ''} onChange={this.onChangeMode} className="form-control" id="mode{{ _uid }}" style={{width: '100%'}}>
                                    <option value="" />
                                    <option value="manual">Manual</option>
                                    <option value="background">Background</option>
                                </Select2Component>
                            </div>
                        </div>
                    </div>
                    {this.state.displayBrowserConnect && (
                    <div className="box-footer">
                        <button type="submit" onClick={this.onBrowserConnected} className="btn btn-info pull-right">
                            Browser connected
                        </button>
                    </div>
                    )}
                </form>
            </div>
        )
    }
}
