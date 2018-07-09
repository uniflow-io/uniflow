import React, {Component} from 'react'
import {Bus} from '../../models/index'
import io from 'socket.io-client';

type Props = {
    bus: Bus
}

export default class ComponentSocketIO extends Component<Props> {
    state = {
        running: false,
        variable: null,
        host: null,
        port: null
    }

    static tags() {
        return ['core']
    }

    componentDidMount() {
        const {bus} = this.props

        bus.on('reset', this.deserialise);
        bus.on('compile', this.onCompile);
        bus.on('execute', this.onExecute);
    }

    componentWillUnmount() {
        const {bus} = this.props

        bus.off('reset', this.deserialise);
        bus.off('compile', this.onCompile);
        bus.off('execute', this.onExecute);
    }

    componentWillReceiveProps(nextProps) {
        const oldProps = this.props;

        if (nextProps.bus !== oldProps.bus) {
            oldProps.bus.off('reset', this.deserialise);
            oldProps.bus.off('compile', this.onCompile);
            oldProps.bus.off('execute', this.onExecute);

            nextProps.bus.on('reset', this.deserialise);
            nextProps.bus.on('compile', this.onCompile);
            nextProps.bus.on('execute', this.onExecute);
        }
    }

    serialise = () => {
        return [this.state.variable, this.state.host, this.state.port]
    }

    deserialise = (data) => {
        let [variable, host, port] = data ? data : [null, null, null];

        this.setState({variable: variable, host: host, port: port})
    }

    onChangeVariable = (event) => {
        this.setState({variable: event.target.value}, this.onUpdate)
    }

    onChangeHost = (event) => {
        this.setState({host: event.target.value}, this.onUpdate)
    }

    onChangePort = (event) => {
        this.setState({port: event.target.value}, this.onUpdate)
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

        let constructorWrapper  = function (url) {
            let newIO  = interpreter.createObjectProto(obj.IO_PROTO),
                socket = io(url),
                wrapper;

            wrapper = function (eventName, callback) {
                socket.on(eventName, callback);
                return this;
            };
            interpreter.setProperty(newIO, 'on', interpreter.createNativeFunction(wrapper, false));

            wrapper = function (eventName) {
                let args     = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
                let callback = arguments[arguments.length - 1];

                return new Promise((resolve) => {
                    args.push(function (data) {
                        callback(interpreter.nativeToPseudo(data));
                        resolve();
                    });
                    socket.emit.apply(socket, args);
                })
            };
            interpreter.setProperty(newIO, 'emit', interpreter.createAsyncFunction(asyncWrapper(wrapper)));

            return newIO;
        };
        obj.IO       = interpreter.createNativeFunction(constructorWrapper, true);
        obj.IO_PROTO = interpreter.getProperty(obj.IO, 'prototype');
        interpreter.setProperty(scope, 'IO', obj.IO);
    }

    onExecute = (runner) => {
        return Promise
            .resolve()
            .then(() => {
                return new Promise((resolve) => {
                    this.setState({running: true}, resolve);
                })
            }).then(() => {
                return runner.eval('var ' + this.state.variable + ' = new IO(\'https://' + this.state.host + ':' + this.state.port + '\')')
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
        const {running, variable, host, port} = this.state

        return (
            <div className="box box-info">
                <form className="form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title"><button type="submit" className="btn btn-default">{running ? <i className="fa fa-refresh fa-spin" /> : <i className="fa fa-refresh fa-cog" />}</button> Socket IO</h3>
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
                            <label htmlFor="port{{ _uid }}" className="col-sm-2 control-label">Port</label>

                            <div className="col-sm-10">
                                <input id="port{{ _uid }}" type="text" value={port || ''} onChange={this.onChangePort} className="form-control"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}