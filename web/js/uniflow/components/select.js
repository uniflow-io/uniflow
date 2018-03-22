import React, {Component} from 'react'
import { Select2 } from 'uniflow/components/index'
import {Bus} from 'uniflow/models/index'
import {connect} from 'react-redux'

type Props = {
    bus: Bus
}

export default class Select extends Component<Props> {
    state = {
        variable: null,
        choices: [],
        selected: null
    }

    static tags() {
        return ['ui']
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
        return [this.state.variable, this.state.choices, this.state.selected];
    }

    deserialise = (data) => {
        let [variable, choices, selected] = data ? data : [null, [], null];

        this.setState({variable: variable, choices: choices, selected: selected})
    }

    onChangeVariable = (event) => {
        this.setState({variable: event.target.value}, this.onUpdate)
    }

    onChangeSelected = (selected) => {
        this.setState({selected: selected}, this.onUpdate)
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
        if (this.state.variable && runner.hasValue(this.state.variable)) {
            this.setState({choices: runner.getValue(this.state.variable)}, this.onUpdate)

            runner.setValue(this.state.variable, this.state.selected);
        }
    }

    render() {
        const {variable, choices, selected} = this.state

        return (
            <div className="box box-info">
                <form className="form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title">Select</h3>
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
                            <label htmlFor="select{{ _uid }}" className="col-sm-2 control-label">Select</label>

                            <div className="col-sm-10">
                                <Select2 value={selected} onChange={this.onChangeSelected} className="form-control" id="select{{ _uid }}" style={{width: '100%'}}>
                                    {Object.keys(choices).map((value) => (
                                        <option key={value} value={choices[value]}>{ choices[value] }</option>
                                    ))}
                                </Select2>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}