import React, {Component} from 'react'
import {Bus} from '../../models/index'
import { ICheckBox } from '../../components/index'

type Props = {
    bus: Bus
}

export default class ComponentCheckBoxes extends Component<Props> {
    state = {
        running: false,
        variable: null,
        checkboxes: {}
    }

    static tags() {
        return ['ui']
    }

    static clients() {
        return ['uniflow']
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
        return [this.state.variable, this.state.checkboxes]
    }

    deserialise = (data) => {
        let [variable, checkboxes] = data ? data : [null, {}];

        this.setState({variable: variable, checkboxes: checkboxes})
    }

    onChangeVariable = (event) => {
        this.setState({variable: event.target.value}, this.onUpdate)
    }

    onChangeCheckBox = (value, checkbox) => {
        let checkboxes = this.state.checkboxes
        checkboxes[checkbox] = value
        this.setState({checkboxes: checkboxes}, this.onUpdate)
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
        return Promise
            .resolve()
            .then(() => {
                return new Promise((resolve) => {
                    this.setState({running: true}, resolve);
                })
            }).then(() => {
                if(this.state.variable && runner.hasValue(this.state.variable)) {
                    let values = runner.getValue(this.state.variable);

                    let checkboxes = {};
                    for (let i = 0; i < values.length; i++) {
                        checkboxes[values[i]] = this.state.checkboxes[values[i]] || false
                    }
                    this.setState({checkboxes: checkboxes}, this.onUpdate)

                    values = values.filter((value) => {
                        return checkboxes[value];
                    });

                    runner.setValue(this.state.variable, values);
                }
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
        const { running, variable, checkboxes} = this.state

        return (
            <div className="box box-info">
                <form className="form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title"><button type="submit" className="btn btn-default">{running ? <i className="fa fa-refresh fa-spin" /> : <i className="fa fa-refresh fa-cog" />}</button> Checkboxes</h3>
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
                            <label htmlFor="checkboxes{{ _uid }}" className="col-sm-2 control-label">Checkboxes</label>

                            <div className="col-sm-10">
                                {Object.keys(checkboxes).map((checkbox) => (
                                    <div key={checkbox} className="checkbox">
                                        <label><ICheckBox value={checkboxes[checkbox]} onChange={(value) => {this.onChangeCheckBox(value, checkbox)}} />{checkbox}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
