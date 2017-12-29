import React, { Component } from 'react'
import { Ace } from 'uniflow/components/index'
import { Bus } from 'uniflow/models/index'

type Props = {
    bus: Bus
}

export default class CoreJavascript extends Component<Props> {
    state = {
        code: null
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
        return this.state.code
    }

    deserialise = (data) => {
        this.setState({code: data})
    }

    onChangeCode = (code) => {
        this.setState({code: code})

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
        runner.eval(this.state.code)
    }

    render() {
        const { code } = this.state

        return (
            <div className="box box-info">
                <form className="form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title">Javascript</h3>
                        <div className="box-tools pull-right">
                            <a className="btn btn-box-tool" onClick={this.onDelete}><i className="fa fa-times" /></a>
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="form-group">
                            <label htmlFor="code{{ _uid }}" className="col-sm-2 control-label">Code</label>

                            <div className="col-sm-10">
                                <Ace className="form-control" id="code{{ _uid }}" value={code} onChange={this.onChangeCode} placeholder="Code" height="200" mode="javascript" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
