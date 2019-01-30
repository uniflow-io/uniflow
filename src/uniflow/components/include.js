import React, { Component } from 'react'
import { Select2Component } from 'uniflow/src/components'
import { Bus } from 'uniflow/src/models'
import {
  getOrderedFeed,
  getProgramData,
  deserialiseFlowData
} from '../../reducers/feed/actions'
import { connect } from 'react-redux'
import createStore from 'uniflow/src/utils/createStore'
import flow from 'uniflow/src/reducers/flow'
import components from '../../uniflow'
import { commitSetFlow } from 'uniflow/src/reducers/flow/actions'

class UiComponent extends Component {
  render () {
    const { tag, bus } = this.props
    const TagName = components[tag]

    return <TagName bus={bus} />
  }
}

class ComponentInclude extends Component {
  state = {
    running: false,
    programId: null,
  }

  constructor (props) {
    super(props)

    this.stack = createStore(flow)
  }

  static tags () {
    return ['core']
  }

  static clients () {
    return ['uniflow', 'bash']
  }

  getFlow = programId => {
    let program = this.props.feed.items[programId]

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

  componentDidMount () {
    const { bus } = this.props

    bus.on('reset', this.deserialise)
    bus.on('compile', this.onCompile)
    bus.on('execute', this.onExecute)

    this.unsubscribe = this.stack.subscribe(() => this.forceUpdate())
  }

  componentWillUnmount () {
    const { bus } = this.props

    bus.off('reset', this.deserialise)
    bus.off('compile', this.onCompile)
    bus.off('execute', this.onExecute)

    this.unsubscribe()
  }

  componentWillReceiveProps (nextProps) {
    const oldProps = this.props

    if (nextProps.bus !== oldProps.bus) {
      oldProps.bus.off('reset', this.deserialise)
      oldProps.bus.off('compile', this.onCompile)
      oldProps.bus.off('execute', this.onExecute)

      nextProps.bus.on('reset', this.deserialise)
      nextProps.bus.on('compile', this.onCompile)
      nextProps.bus.on('execute', this.onExecute)
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

  onCompile = (interpreter, scope, asyncWrapper) => {
    return this.getFlow(this.state.programId).then(() => {
      let flow = this.stack.getState()
      return flow.reduce((promise, item) => {
        return promise.then(() => {
          return item.bus.emit('compile', interpreter, scope, asyncWrapper)
        })
      }, Promise.resolve())
    })
  }

  onExecute = runner => {
    return Promise.resolve()
      .then(() => {
        return new Promise(resolve => {
          this.setState({ running: true }, resolve)
        })
      })
      .then(() => {
        let flow = this.stack.getState()
        return flow.reduce((promise, item) => {
          return promise.then(() => {
            return item.bus.emit('execute', runner)
          })
        }, Promise.resolve())
      })
      .then(() => {
        return new Promise(resolve => {
          setTimeout(resolve, 500)
        })
      })
      .then(() => {
        return new Promise(resolve => {
          this.setState({ running: false }, resolve)
        })
      })
  }

  render () {
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
              <a className="btn btn-box-tool" onClick={this.onDelete}>
                <i className="fa fa-times" />
              </a>
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
        <UiComponent key={i} tag={item.component} bus={item.bus} />
      ))
    )
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    feed: state.feed,
  }
})(ComponentInclude)
