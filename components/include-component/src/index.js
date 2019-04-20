import React, { Component } from 'react'
import { uniflow } from '../package'
import { onCompile, onExecute } from '../clients/uniflow'
import { Select2Component } from 'uniflow/src/components'
import {
    getOrderedFeed,
    getProgramData,
    deserialiseFlowData,
} from './reducers/feed/actions'
import { connect } from 'react-redux'
import createStore from 'uniflow/src/utils/createStore'
import flow from 'uniflow/src/reducers/flow'
import { commitSetFlow } from 'uniflow/src/reducers/flow/actions'

class UiComponent extends Component {
    render() {
        const { tag, bus } = this.props
        const TagName = this.props.components[tag]

        return <TagName bus={bus} />
    }
}

class IncludeComponent extends Component {
    state = {
        running: false,
        programId: null,
    }

    constructor(props) {
        super(props)

        this.stack = createStore(flow)
    }

    static tags() {
        return uniflow.tags
    }

    static clients() {
        return uniflow.clients
    }

    getFlow = programId => {
        let program = this.props.feed.items['program_' + programId]

        return Promise.resolve()
            .then(() => {
                return this.props.dispatch(
                    getProgramData(program, this.props.auth.token)
                )
            })
            .then(data => {
                if (!data) return

                program.data = data

                return this.setFlow(deserialiseFlowData(data))
            })
    }

    setFlow = stack => {
        return this.stack.dispatch(commitSetFlow(stack)).then(() => {
            return Promise.all(
                stack.map(item => {
                    return item.bus.emit('reset', item.data)
                })
            )
        })
    }

    componentDidMount() {
        const { bus } = this.props

        bus.on('reset', this.deserialise)
        bus.on('compile', onCompile.bind(this))
        bus.on('execute', onExecute.bind(this))

        this.unsubscribe = this.stack.subscribe(() => this.forceUpdate())
    }

    componentWillUnmount() {
        const { bus } = this.props

        bus.off('reset', this.deserialise)
        bus.off('compile', onCompile.bind(this))
        bus.off('execute', onExecute.bind(this))

        this.unsubscribe()
    }

    componentWillReceiveProps(nextProps) {
        const oldProps = this.props

        if (nextProps.bus !== oldProps.bus) {
            oldProps.bus.off('reset', this.deserialise)
            oldProps.bus.off('compile', onCompile.bind(this))
            oldProps.bus.off('execute', onExecute.bind(this))

            nextProps.bus.on('reset', this.deserialise)
            nextProps.bus.on('compile', onCompile.bind(this))
            nextProps.bus.on('execute', onExecute.bind(this))
        }
    }

    serialise = () => {
        return [this.state.programId]
    }

    deserialise = data => {
        let [programId] = data || [null]

        this.setState({ programId: programId })
    }

    onChangeSelected = programId => {
        this.setState({ programId: programId }, this.onUpdate)
    }

    onUpdate = () => {
        this.props.onUpdate(this.serialise())
    }

    onDelete = event => {
        event.preventDefault()

        this.props.onPop()
    }

    render() {
        const { running, programId } = this.state
        const stack = this.stack.getState()

        return [
            <div className="box box-info" key="info">
                <form className="form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title">
                            <button type="submit" className="btn btn-default">
                                {running ? (
                                    <i className="fa fa-refresh fa-spin" />
                                ) : (
                                    <i className="fa fa-refresh fa-cog" />
                                )}
                            </button>
                            Include
                        </h3>
                        <div className="box-tools pull-right">
                            <button className="btn btn-box-tool" onClick={this.onDelete}>
                                <i className="fa fa-times" />
                            </button>
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="form-group">
                            <label
                                htmlFor="select{{ _uid }}"
                                className="col-sm-2 control-label"
                            >
                                Select
                            </label>

                            <div className="col-sm-10">
                                <Select2Component
                                    value={programId}
                                    onChange={this.onChangeSelected}
                                    className="form-control"
                                    id="select{{ _uid }}"
                                    options={getOrderedFeed(this.props.feed).map((item, i) => {
                                        return { value: item.id, label: item.title }
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>,
        ].concat(
            stack.map((item, i) => (
                <UiComponent key={i} components={this.props.components} tag={item.component} bus={item.bus} />
            ))
        )
    }
}

export default connect(state => {
    return {
        auth: state.auth,
        feed: state.feed,
    }
})(IncludeComponent)
