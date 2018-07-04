import React, {Component} from 'react'
import {ComponentList} from '../../components/index'
import {Bus} from '../../models/index'
import createStore from '../../utils/createStore'
import flow from '../../reducers/flow/index'
import {
    commitPushFlow,
    commitPopFlow,
    commitUpdateFlow,
    commitSetFlow
} from '../../reducers/flow/actions'

type Props = {
    bus: Bus
}

export default class ComponentWhile extends Component<Props> {
    state = {
        conditionStack: [],
        conditionRunIndex: null,
        executeStack: [],
        executeRunIndex: null,
    }

    constructor(props) {
        super(props)

        this.store = {
            conditionStack: [],
            executeStack: [],
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
        return {
            condition: this.state.conditionStack.map((item) => {
                return {
                    component: item.component,
                    data: item.data
                }
            }),
            execute: this.state.executeStack.map((item) => {
                return {
                    component: item.component,
                    data: item.data
                }
            })
        }
    }

    deserialise = (data) => {
        let createStoreStack = function(stack) {
            return stack.reduce((promise, item, index) => {
                return promise.then((store) => {
                    return store.dispatch(commitPushFlow(index, item.component))
                        .then(() => {
                            return store.dispatch(commitUpdateFlow(index, item.data))
                        }).then(() => {
                            return store
                        })
                })
            }, Promise.resolve(createStore(flow)))
        }

        Promise.all([
            createStoreStack(data && data.condition || []),
            createStoreStack(data && data.execute || [])
        ]).then(([conditionStack, executeStack]) => {
            this.store = {
                conditionStack: conditionStack,
                executeStack: executeStack,
            }

            let state = {
                conditionStack: this.store.conditionStack.getState(),
                conditionRunIndex: null,
                executeStack: this.store.executeStack.getState(),
                executeRunIndex: null,
            }

            return new Promise((resolve) => {
                this.setState(state, resolve)
            }).then(() => {
                return state
            })
        }).then((state) => {
            let resetStack = (stack) => {
                for (let i = 0; i < stack.length; i++) {
                    let item = stack[i];
                    item.bus.emit('reset', item.data);
                }
            }

            resetStack(state.conditionStack)
            resetStack(state.executeStack)
        })
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

    onUpdate = () => {
        this.props.onUpdate(this.serialise())
    }

    onDelete = (event) => {
        event.preventDefault()

        this.props.onPop()
    }

    onCompile = (interpreter, scope, asyncWrapper) => {
        [this.state.conditionStack, this.state.executeStack]
            .forEach((stack) => {
                stack.forEach((item) => {
                    item.bus.emit('compile', interpreter, scope);
                })
            })
    }

    onExecute = (runner) => {
        let stackEval = function(stack) {
            return stack.reduce((promise, item) => {
                return promise.then(() => {
                    return item.bus.emit('execute', runner)
                })
            }, Promise.resolve()).then(() => {
                return runner.getReturn()
            })
        }

        let promiseWhile = () => {
            return stackEval(this.state.conditionStack)
                .then((value) => {
                    if(value === true) {
                        return stackEval(this.state.executeStack).then(promiseWhile)
                    }
                })
        }

        return promiseWhile()
    }

    render() {
        return (
            <div>
                <div className="box box-info">
                    <form className="form-horizontal">
                        <div className="box-header with-border">
                            <h3 className="box-title">While</h3>
                            <div className="box-tools pull-right">
                                <a className="btn btn-box-tool" onClick={this.onDelete}><i className="fa fa-times"/></a>
                            </div>
                        </div>
                    </form>
                </div>
                <ComponentList stack={this.state.conditionStack} runIndex={this.state.conditionRunIndex}
                               onPush={(index, component) => {this.onPushFlow(['conditionStack'], index, component)}}
                               onPop={(index) => {this.onPopFlow(['conditionStack'], index)}}
                               onUpdate={(index, data) => {this.onUpdateFlow(['conditionStack'], index, data)}}
                               onRun={null} />
                <div className="box box-info">
                    <form className="form-horizontal">
                        <div className="box-header with-border">
                            <h3 className="box-title">Do</h3>
                        </div>
                    </form>
                </div>
                <ComponentList stack={this.state.executeStack} runIndex={this.state.executeRunIndex}
                               onPush={(index, component) => {this.onPushFlow(['executeStack'], index, component)}}
                               onPop={(index) => {this.onPopFlow(['executeStack'], index)}}
                               onUpdate={(index, data) => {this.onUpdateFlow(['executeStack'], index, data)}}
                               onRun={null} />
                <div className="box box-info">
                    <form className="form-horizontal">
                        <div className="box-header with-border">
                            <h3 className="box-title">EndWhile</h3>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}