import React, { Component } from 'react'
import { onCode, onExecute } from './runner'
import { FlowHeader, Rail } from '@uniflow-io/uniflow-client/src/components'
import createStore from '@uniflow-io/uniflow-client/src/utils/create-store'
import rail from '@uniflow-io/uniflow-client/src/reducers/rail'
import {
  commitPushFlow,
  commitPopFlow,
  commitUpdateFlow,
} from '@uniflow-io/uniflow-client/src/reducers/rail/actions'
import {
  setBusEvents,
  componentDidMount,
  componentWillUnmount,
  componentDidUpdate,
  onExecuteHelper,
  onUpdate,
  onDelete,
} from '@uniflow-io/uniflow-client/src/utils/flow'

class WhileFlow extends Component {
  state = {
    isRunning: false,
    conditionRail: [],
    conditionRunIndex: null,
    executeRail: [],
    executeRunIndex: null,
  }

  constructor(props) {
    super(props)

    this.store = {
      conditionRail: [],
      executeRail: [],
    }
    setBusEvents(
      {
        deserialize: this.deserialize,
        code: onCode.bind(this),
        execute: onExecuteHelper(onExecute.bind(this), this),
      },
      this
    )
  }

  componentDidMount() {
    componentDidMount(this)
  }

  componentWillUnmount() {
    componentWillUnmount(this)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(prevProps, this)
  }

  serialize = () => {
    return {
      condition: this.state.conditionRail.map(item => {
        return {
          flow: item.flow,
          data: item.data,
        }
      }),
      execute: this.state.executeRail.map(item => {
        return {
          flow: item.flow,
          data: item.data,
        }
      }),
    }
  }

  deserialize = data => {
    let createStoreRail = function(railStore) {
      return railStore.reduce((promise, item, index) => {
        return promise.then(store => {
          return store
            .dispatch(commitPushFlow(index, item.flow))
            .then(() => {
              return store.dispatch(commitUpdateFlow(index, item.data))
            })
            .then(() => {
              return store
            })
        })
      }, Promise.resolve(createStore(rail)))
    }

    Promise.all([
      createStoreRail(data ? data.condition : []),
      createStoreRail(data ? data.execute : []),
    ])
      .then(([conditionRail, executeRail]) => {
        this.store = {
          conditionRail: conditionRail,
          executeRail: executeRail,
        }

        let state = {
          conditionRail: this.store.conditionRail.getState(),
          conditionRunIndex: null,
          executeRail: this.store.executeRail.getState(),
          executeRunIndex: null,
        }

        return new Promise(resolve => {
          this.setState(state, resolve)
        }).then(() => {
          return state
        })
      })
      .then(state => {
        let resetRail = rail => {
          for (let i = 0; i < rail.length; i++) {
            let item = rail[i]
            item.bus.emit('deserialize', item.data)
          }
        }

        resetRail(state.conditionRail)
        resetRail(state.executeRail)
      })
  }

  dispatchFlow = (propertyPath, action) => {
    let store = this.store
    propertyPath.forEach(key => {
      store = store[key]
    })

    return store
      .dispatch(action)
      .then(() => {
        return new Promise(resolve => {
          let state = Object.assign({}, this.state)
          let el = state
          propertyPath.slice(0, propertyPath.length - 1).forEach(key => {
            el = el[key]
          })
          el[propertyPath[propertyPath.length - 1]] = store.getState()
          this.setState(state, resolve)
        })
      })
      .then(onUpdate(this))
  }

  onPushFlow = (propertyPath, index, flow) => {
    this.dispatchFlow(propertyPath, commitPushFlow(index, flow))
  }

  onPopFlow = (propertyPath, index) => {
    this.dispatchFlow(propertyPath, commitPopFlow(index))
  }

  onUpdateFlow = (propertyPath, index, data) => {
    this.dispatchFlow(propertyPath, commitUpdateFlow(index, data))
  }

  render() {
    const { clients, onRun } = this.props
    const { isRunning } = this.state

    return (
      <>
        <FlowHeader
          title="While"
          clients={clients}
          isRunning={isRunning}
          onRun={onRun}
          onDelete={onDelete(this)}
        />
        <Rail
          rail={this.state.conditionRail}
          runIndex={this.state.conditionRunIndex}
          flows={this.props.flows}
          userFlows={this.props.userFlows}
          onPush={(index, flow) => {
            this.onPushFlow(['conditionRail'], index, flow)
          }}
          onPop={index => {
            this.onPopFlow(['conditionRail'], index)
          }}
          onUpdate={(index, data) => {
            this.onUpdateFlow(['conditionRail'], index, data)
          }}
          onRun={null}
        />
        <div className="row">
          <div className="col">
            <h4>Do</h4>
          </div>
        </div>
        <Rail
          rail={this.state.executeRail}
          runIndex={this.state.executeRunIndex}
          flows={this.props.flows}
          userFlows={this.props.userFlows}
          onPush={(index, flow) => {
            this.onPushFlow(['executeRail'], index, flow)
          }}
          onPop={index => {
            this.onPopFlow(['executeRail'], index)
          }}
          onUpdate={(index, data) => {
            this.onUpdateFlow(['executeRail'], index, data)
          }}
          onRun={null}
        />
        <div className="row">
          <div className="col">
            <h4>EndWhile</h4>
          </div>
        </div>
      </>
    )
  }
}

export default WhileFlow
