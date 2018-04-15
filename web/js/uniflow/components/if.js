import React, {Component} from 'react'
import {ComponentList} from 'uniflow/components/index'
import {Bus} from 'uniflow/models/index'
import createStore from 'uniflow/utils/createStore'
import flow from 'uniflow/reducers/flow/index'
import {
    commitPushFlow,
    commitPopFlow,
    commitUpdateFlow,
    commitSetFlow
} from 'uniflow/reducers/flow/actions'

type Props = {
    bus: Bus
}

export default class ComponentIf extends Component<Props> {
    state = {
        if: {
            conditionStack: [],
            conditionRunIndex: null,
            executeStack: [],
            executeRunIndex: null,
        },
        elseIfs: [],
        else: null
    }

    constructor(props) {
        super(props)

        this.store = {
            if: {
                conditionStack: createStore(flow),
                executeStack: createStore(flow),
            },
            elseIfs: [],
            else: null
        }
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
        return this.state.code
    }

    deserialise = (data) => {
        this.setState({code: data})
    }

    dispatchFlow = (propertyPath, action) => {
        let store = this.store
        propertyPath.forEach((key) => {
            store = store[key]
        })

        return store.dispatch(action)
            .then(() => {
                return new Promise((resolve) => {
                    let state = Object.assign({}, this.state);
                    let el = state
                    propertyPath.slice(0, propertyPath.length - 1).forEach((key) => {
                        el = el[key]
                    })
                    el[propertyPath[propertyPath.length - 1]] = store.getState()
                    this.setState(state, resolve)
                })
            })
            .then(this.onUpdate)
    }

    onPushFlow = (propertyPath, index, component) => {
        this.dispatchFlow(propertyPath, commitPushFlow(index, component))
    }

    onPopFlow = (propertyPath, index) => {
        this.dispatchFlow(propertyPath, commitPopFlow(index))
    }

    onUpdateFlow = (propertyPath, index, data) => {
        this.dispatchFlow(propertyPath, commitUpdateFlow(index, data))
    }

    onRemoveElseIf = (event, index) => {
        event.preventDefault()

        this.store.elseIfs.splice(index, 1);

        let elseIfs = this.state.elseIfs.slice()
        elseIfs.splice(index, 1);
        this.setState({elseIfs: elseIfs}, this.onUpdate)
    }

    onAddElseIf = (event) => {
        event.preventDefault()

        this.store.elseIfs.push({
            conditionStack: createStore(flow),
            executeStack: createStore(flow),
        })

        let elseIfs = this.state.elseIfs.slice()
        elseIfs.push({
            conditionStack: [],
            conditionRunIndex: null,
            executeStack: [],
            executeRunIndex: null,
        });
        this.setState({elseIfs: elseIfs}, this.onUpdate)
    }

    onRemoveElse = (event) => {
        event.preventDefault()

        this.store.else = null;

        this.setState({else: null}, this.onUpdate)
    }

    onAddElse = (event) => {
        event.preventDefault()

        this.store.else = {
            conditionStack: createStore(flow),
            executeStack: createStore(flow),
        }

        this.setState({else: {
            executeStack: [],
            executeRunIndex: null,
        }}, this.onUpdate)
    }

    onUpdate = () => {
        //this.props.onUpdate(this.serialise())
    }

    onDelete = (event) => {
        event.preventDefault()

        this.props.onPop()
    }

    onCompile = (interpreter, scope) => {

    }

    onExecute = (runner) => {
        //runner.eval('')
    }

    render() {
        return (
            <div>
                <div className="box box-info">
                    <form className="form-horizontal">
                        <div className="box-header with-border">
                            <h3 className="box-title">If</h3>
                            <div className="box-tools pull-right">
                                <a className="btn btn-box-tool" onClick={this.onDelete}><i className="fa fa-times"/></a>
                            </div>
                        </div>
                    </form>
                </div>
                <ComponentList stack={this.state.if.conditionStack} runIndex={this.state.if.conditionRunIndex}
                               onPush={(index, component) => {this.onPushFlow(['if', 'conditionStack'], index, component)}}
                               onPop={(index) => {this.onPopFlow(['if', 'conditionStack'], index)}}
                               onUpdate={(index, data) => {this.onUpdateFlow(['if', 'conditionStack'], index, data)}}
                               onRun={() => {}} />
                <div className="box box-info">
                    <form className="form-horizontal">
                        <div className="box-header with-border">
                            <h3 className="box-title">Then</h3>
                        </div>
                    </form>
                </div>
                <ComponentList stack={this.state.if.executeStack} runIndex={this.state.if.executeRunIndex}
                               onPush={(index, component) => {this.onPushFlow(['if', 'executeStack'], index, component)}}
                               onPop={(index) => {this.onPopFlow(['if', 'executeStack'], index)}}
                               onUpdate={(index, data) => {this.onUpdateFlow(['if', 'executeStack'], index, data)}}
                               onRun={() => {}} />
                {this.state.elseIfs.map((item, elseIfIndex) => (
                <div key={("elseIf" + elseIfIndex)}>
                    <div className="box box-info">
                        <form className="form-horizontal">
                            <div className="box-header with-border">
                                <h3 className="box-title">Else If</h3>
                                <div className="box-tools pull-right">
                                    <a className="btn btn-box-tool" onClick={(event, index) => {
                                        this.onRemoveElseIf(event, index)
                                    }}><i className="fa fa-times"/></a>
                                </div>
                            </div>
                        </form>
                    </div>
                    <ComponentList stack={item.conditionStack} runIndex={item.conditionRunIndex}
                                   onPush={(index, component) => {this.onPushFlow(['elseIfs', elseIfIndex, 'conditionStack'], index, component)}}
                                   onPop={(index) => {this.onPopFlow(['elseIfs', elseIfIndex, 'conditionStack'], index)}}
                                   onUpdate={(index, data) => {this.onUpdateFlow(['elseIfs', elseIfIndex, 'conditionStack'], index, data)}}
                                   onRun={() => {}} />
                    <div className="box box-info">
                        <form className="form-horizontal">
                            <div className="box-header with-border">
                                <h3 className="box-title">Then</h3>
                            </div>
                        </form>
                    </div>
                    <ComponentList stack={item.executeStack} runIndex={item.executeRunIndex}
                                   onPush={(index, component) => {this.onPushFlow(['elseIfs', elseIfIndex, 'executeStack'], index, component)}}
                                   onPop={(index) => {this.onPopFlow(['elseIfs', elseIfIndex, 'executeStack'], index)}}
                                   onUpdate={(index, data) => {this.onUpdateFlow(['elseIfs', elseIfIndex, 'executeStack'], index, data)}}
                                   onRun={() => {}} />

                </div>
                ))}
                {this.state.else && (
                <div key={'else'}>
                    <div className="box box-info">
                        <form className="form-horizontal">
                            <div className="box-header with-border">
                                <h3 className="box-title">Else</h3>
                                <div className="box-tools pull-right">
                                    <a className="btn btn-box-tool" onClick={this.onRemoveElse}><i className="fa fa-times"/></a>
                                </div>
                            </div>
                        </form>
                    </div>
                    <ComponentList stack={this.state.else.executeStack} runIndex={this.state.else.executeRunIndex}
                                   onPush={(index, component) => {this.onPushFlow(['else', 'executeStack'], index, component)}}
                                   onPop={(index) => {this.onPopFlow(['else', 'executeStack'], index)}}
                                   onUpdate={(index, data) => {this.onUpdateFlow(['else', 'executeStack'], index, data)}}
                                   onRun={() => {}} />
                </div>
                )}
                <div className="box box-info">
                    <form className="form-horizontal">
                        <div className="box-header with-border">
                            <h3 className="box-title">Endif</h3>
                            <button type="submit" onClick={this.onAddElse} className="btn btn-info pull-right">
                                Add Else
                            </button>
                            <button type="submit" onClick={this.onAddElseIf} className="btn btn-info pull-right">
                                Add Else If
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
