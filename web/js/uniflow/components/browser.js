import React, { Component } from 'react'
import { Select2 } from '../../components/index'
import { Bus } from '../../models/index'

/*import { Browser } from 'remote-browser';

const browser = new Browser();
browser.launch()
    .then(() =>  {
        console.log('toto')
    })*/

type Props = {
    bus: Bus
}

export default class ComponentBrowser extends Component<Props> {
    state = {
        variable: null,
        port: null,
        mode: null
    }

    static tags() {
        return ['core']
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
        return [this.state.variable, this.state.port, this.state.mode]
    }

    deserialise = (data) => {
        let [variable, port, mode] = data ? data : [null, null, null];
        
        this.setState({variable: variable, port: port, mode: mode})
    }

    onChangeVariable = (event) => {
        this.setState({variable: event.target.value}, this.onUpdate)
    }

    onChangePort = (event) => {
        this.setState({port: event.target.value}, this.onUpdate)
    }

    onChangeMode = (mode) => {
        this.setState({mode: mode}, this.onUpdate)
    }

    onUpdate = () => {
        this.props.onUpdate(this.serialise())
    }

    onDelete = (event) => {
        event.preventDefault()

        this.props.onPop()
    }

    onCompile = (interpreter, scope, asyncWrapper) => {

    }

    onExecute = (runner) => {
        
    }

    render() {
        const { variable, port, mode } = this.state

        return (
            <div className="box box-info">
                <form className="form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title">Browser</h3>
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
                            <label htmlFor="port{{ _uid }}" className="col-sm-2 control-label">Port</label>

                            <div className="col-sm-10">
                                <input id="port{{ _uid }}" type="text" value={port || ''} onChange={this.onChangePort} className="form-control"/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="mode{{ _uid }}" className="col-sm-2 control-label">Mode</label>

                            <div className="col-sm-10">
                                <Select2 value={mode || ''} onChange={this.onChangeMode} className="form-control" id="mode{{ _uid }}" style={{width: '100%'}}>
                                    <option value="" />
                                    <option value="manual">Manual</option>
                                    <option value="background">Background</option>
                                </Select2>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
