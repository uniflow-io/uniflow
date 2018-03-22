import React, {Component} from 'react'
import {Bus} from 'uniflow/models/index'

type Props = {
    bus: Bus
}

export default class ComponentYamlAdd extends Component<Props> {
    state = {
        variable: null,
        keyvaluevariable: null,
        keyvaluelist: []
    }

    static tags() {
        return ['yaml']
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

    transform = () => {
        return this.state.keyvaluelist.reduce(function (object, item) {
            if (item.key) {
                object[item.key] = item.value
            }
            return object
        }, {})
    }

    reverseTransform = (object) => {
        return Object.keys(object).reduce(function (list, key) {
            list.push({key: key, value: object[key]})
            return list;
        }, [])
    }

    serialise = () => {
        let object = this.transform()
        return [this.state.variable, this.state.keyvaluevariable, object]
    }

    deserialise = (data) => {
        let [variable, keyvaluevariable, object] = data ? data : [null, null, {}];
        let keyvaluelist                         = this.reverseTransform(object)

        this.setState({variable: variable, keyvaluevariable: keyvaluevariable, keyvaluelist: keyvaluelist})
    }

    onChangeVariable = (event) => {
        this.setState({variable: event.target.value}, this.onUpdate)
    }

    onChangeKeyvaluevariable = (event) => {
        this.setState({keyvaluevariable: event.target.value}, this.onUpdate)
    }

    onUpdateItemKey = (event, index) => {
        this.setState({
            keyvaluelist: this.state.keyvaluelist.map((item, i) => {
                if (i !== index) {
                    return item;
                }

                return {
                    ...item,
                    ...{key: event.target.value}
                };
            })
        }, this.onUpdate)
    }

    onUpdateItemValue = (event, index) => {
        this.setState({
            keyvaluelist: this.state.keyvaluelist.map((item, i) => {
                if (i !== index) {
                    return item;
                }

                return {
                    ...item,
                    ...{value: event.target.value}
                };
            })
        }, this.onUpdate)
    }

    onRemoveItem = (event, index) => {
        event.preventDefault()

        let keyvaluelist = this.state.keyvaluelist.slice()
        keyvaluelist.splice(index, 1);
        this.setState({keyvaluelist: keyvaluelist}, this.onUpdate)
    }

    onAddItem = (event) => {
        event.preventDefault()

        let keyvaluelist = this.state.keyvaluelist.slice()
        keyvaluelist.push({key: '', value: ''});
        this.setState({keyvaluelist: keyvaluelist}, this.onUpdate)
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
        if (this.state.keyvaluevariable) {
            if (runner.hasValue(this.state.keyvaluevariable)) {
                let object       = runner.getValue(this.state.keyvaluevariable);
                let keyvaluelist = this.reverseTransform(object);
                this.setState({keyvaluelist: keyvaluelist}, this.onUpdate)
            } else {
                let object = this.transform();
                runner.setValue(this.state.keyvaluevariable, object);
            }
        }
    }

    render() {
        const {variable, keyvaluevariable, keyvaluelist} = this.state

        return (
            <div className="box box-info">
                <form className="form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title">Yaml Add</h3>
                        <div className="box-tools pull-right">
                            <a className="btn btn-box-tool" onClick={this.onDelete}><i className="fa fa-times"/></a>
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="form-group">
                            <label htmlFor="variable{{ _uid }}" className="col-sm-2 control-label">Variable</label>

                            <div className="col-sm-10">
                                <input id="variable{{ _uid }}" type="text" value={variable || ''}
                                       onChange={this.onChangeVariable} className="form-control"/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="variable{{ _uid }}" className="col-sm-2 control-label">Variable Keys Values</label>

                            <div className="col-sm-10">
                                <input id="variable{{ _uid }}" type="text" value={keyvaluevariable || ''}
                                       onChange={this.onChangeKeyvaluevariable} className="form-control"/>
                            </div>
                        </div>

                        {keyvaluelist.map((item, index) => (
                            <div className="form-group" key={index}>
                                <div className="col-sm-4 col-sm-offset-2">
                                    <input type="text" value={keyvaluelist[index].key}
                                           onChange={(event) => this.onUpdateItemKey(event, index)}
                                           className="form-control" placeholder="key"/>
                                </div>
                                <div className="col-sm-6">
                                    <div className="input-group">
                                        <input type="text" value={keyvaluelist[index].value}
                                               onChange={(event) => this.onUpdateItemValue(event, index)}
                                               className="form-control" placeholder="value"/>
                                        <span className="input-group-addon" onClick={(event) => {
                                            this.onRemoveItem(event, index)
                                        }}><i className="fa fa-times"/></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="box-footer">
                        <button type="submit" onClick={this.onAddItem} className="btn btn-info pull-right">
                            Add Item
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}
