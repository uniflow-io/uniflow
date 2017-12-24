import React, { Component } from 'react'
import { Ace } from 'uniflow/components/index'
import { Bus } from 'uniflow/models/index'

type Props = {
    bus: Bus
}

export default class CoreText extends Component<Props> {
    state = {
        variable: '',
        text: ''
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
        return [this.state.variable, this.state.text]
    }

    deserialise = (data) => {
        let [variable, text] = data ? data : ['', ''];

        this.setState({variable: variable, text: text})
    }

    onChangeVariable = (event) => {
        this.setState({variable: event.target.value})

        this.onUpdate()
    }

    onChangeText = (text) => {
        this.setState({text: text})

        this.onUpdate()
    }

    onUpdate = () => {
        this.props.onUpdate(this.serialise())
    }

    onDelete = (event) => {
        event.preventDefault()

        this.props.onPop()
    }

    onCompile = (interpreter, scope) => {

    }

    onExecute = (runner) => {
        if(this.state.variable) {
            if(runner.hasValue(this.state.variable)) {
                this.state.text = runner.getValue(this.state.variable);
            } else {
                runner.setValue(this.state.variable, this.state.text);
            }
        }
    }

    render() {
        const { variable, text } = this.state

        return (
            <div className="box box-info">
                <form className="form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title">Text</h3>
                        <div className="box-tools pull-right">
                            <a className="btn btn-box-tool" onClick={this.onDelete}><i className="fa fa-times" /></a>
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="form-group">
                            <label htmlFor="variable{{ _uid }}" className="col-sm-2 control-label">Variable</label>

                            <div className="col-sm-10">
                                <input id="variable{{ _uid }}" type="text" value={variable} onChange={this.onChangeVariable} className="form-control" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="text{{ _uid }}" className="col-sm-2 control-label">Text</label>

                            <div className="col-sm-10">
                                <Ace className="form-control" id="text{{ _uid }}" value={text} onChange={this.onChangeText} placeholder="Text" height="200" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}