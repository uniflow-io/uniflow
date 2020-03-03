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

class IfFlow extends Component {
  state = {
    isRunning: false,
    if: {
      conditionRail: [],
      conditionRunIndex: null,
      executeRail: [],
      executeRunIndex: null,
    },
    elseIfs: [],
    else: null,
  }

  constructor(props) {
    super(props)

    this.store = {
      if: {
        conditionRail: [],
        executeRail: [],
      },
      elseIfs: [],
      else: null,
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
      if: {
        condition: this.state.if.conditionRail.map(item => {
          return {
            flow: item.flow,
            data: item.data,
          }
        }),
        execute: this.state.if.executeRail.map(item => {
          return {
            flow: item.flow,
            data: item.data,
          }
        }),
      },
      elseIfs: this.state.elseIfs.map(elseIf => {
        return {
          condition: elseIf.conditionRail.map(item => {
            return {
              flow: item.flow,
              data: item.data,
            }
          }),
          execute: elseIf.executeRail.map(item => {
            return {
              flow: item.flow,
              data: item.data,
            }
          }),
        }
      }),
      else: this.state.else
        ? this.state.else.executeRail.map(item => {
            return {
              flow: item.flow,
              data: item.data,
            }
          })
        : null,
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
      createStoreRail(
        data && data.if && data.if.condition ? data.if.condition : []
      ),
      createStoreRail(
        data && data.if && data.if.execute ? data.if.execute : []
      ),
      data && data.elseIfs
        ? data.elseIfs.reduce((promise, elseIf) => {
            return promise.then(elseIfs => {
              return Promise.all([
                createStoreRail(elseIf.condition || []),
                createStoreRail(elseIf.execute || []),
              ]).then(([conditionRail, executeRail]) => {
                elseIfs.push({
                  conditionRail: conditionRail,
                  executeRail: executeRail,
                })
                return elseIfs
              })
            })
          }, Promise.resolve([]))
        : [],
      data && data.else ? createStoreRail(data.else || []) : null,
    ])
      .then(([ifConditionRail, ifExecuteRail, elseIfsRail, elseRail]) => {
        this.store = {
          if: {
            conditionRail: ifConditionRail,
            executeRail: ifExecuteRail,
          },
          elseIfs: elseIfsRail,
          else: elseRail
            ? {
                executeRail: elseRail,
              }
            : null,
        }

        let state = {
          if: {
            conditionRail: this.store.if.conditionRail.getState(),
            conditionRunIndex: null,
            executeRail: this.store.if.executeRail.getState(),
            executeRunIndex: null,
          },
          elseIfs: [],
          else: null,
        }

        this.store.elseIfs.forEach(elseIf => {
          state.elseIfs.push({
            conditionRail: elseIf.conditionRail.getState(),
            conditionRunIndex: null,
            executeRail: elseIf.executeRail.getState(),
            executeRunIndex: null,
          })
        })

        if (this.store.else) {
          state.else = {
            executeRail: this.store.else.executeRail.getState(),
            executeRunIndex: null,
          }
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

        resetRail(state.if.conditionRail)
        resetRail(state.if.executeRail)
        state.elseIfs.forEach(elseIf => {
          resetRail(elseIf.conditionRail)
          resetRail(elseIf.executeRail)
        })
        if (state.else) {
          resetRail(state.else.executeRail)
        }
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
      .then(this.onUpdate)
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

  onRemoveElseIf = (event, index) => {
    event.preventDefault()

    this.store.elseIfs.splice(index, 1)

    let elseIfs = this.state.elseIfs.slice()
    elseIfs.splice(index, 1)
    this.setState({ elseIfs: elseIfs }, onUpdate(this))
  }

  onAddElseIf = event => {
    event.preventDefault()

    this.store.elseIfs.push({
      conditionRail: createStore(rail),
      executeRail: createStore(rail),
    })

    let elseIfs = this.state.elseIfs.slice()
    elseIfs.push({
      conditionRail: [],
      conditionRunIndex: null,
      executeRail: [],
      executeRunIndex: null,
    })
    this.setState({ elseIfs: elseIfs }, onUpdate(this))
  }

  onRemoveElse = event => {
    event.preventDefault()

    this.store.else = null

    this.setState({ else: null }, onUpdate(this))
  }

  onAddElse = event => {
    event.preventDefault()

    this.store.else = {
      executeRail: createStore(rail),
    }

    this.setState(
      {
        else: {
          executeRail: [],
          executeRunIndex: null,
        },
      },
      onUpdate(this)
    )
  }

  render() {
    const { clients, onRun } = this.props
    const { isRunning } = this.state

    return (
      <>
        <FlowHeader
          title="If"
          clients={clients}
          isRunning={isRunning}
          onRun={onRun}
          onDelete={onDelete(this)}
        />
        <Rail
          rail={this.state.if.conditionRail}
          runIndex={this.state.if.conditionRunIndex}
          flows={this.props.flows}
          userFlows={this.props.userFlows}
          onPush={(index, flow) => {
            this.onPushFlow(['if', 'conditionRail'], index, flow)
          }}
          onPop={index => {
            this.onPopFlow(['if', 'conditionRail'], index)
          }}
          onUpdate={(index, data) => {
            this.onUpdateFlow(['if', 'conditionRail'], index, data)
          }}
          onRun={null}
        />
        <div className="row">
          <div className="col">
            <h4>Then</h4>
          </div>
        </div>
        <Rail
          rail={this.state.if.executeRail}
          runIndex={this.state.if.executeRunIndex}
          flows={this.props.flows}
          userFlows={this.props.userFlows}
          onPush={(index, flow) => {
            this.onPushFlow(['if', 'executeRail'], index, flow)
          }}
          onPop={index => {
            this.onPopFlow(['if', 'executeRail'], index)
          }}
          onUpdate={(index, data) => {
            this.onUpdateFlow(['if', 'executeRail'], index, data)
          }}
          onRun={null}
        />
        {this.state.elseIfs.map((item, elseIfIndex) => (
          <React.Fragment key={'elseIf' + elseIfIndex}>
            <FlowHeader
              title="Else If"
              clients={clients}
              isRunning={isRunning}
              onRun={onRun}
              onDelete={(event, index) => {
                this.onRemoveElseIf(event, index)
              }}
            />
            <Rail
              rail={item.conditionRail}
              runIndex={item.conditionRunIndex}
              flows={this.props.flows}
              userFlows={this.props.userFlows}
              onPush={(index, flow) => {
                this.onPushFlow(
                  ['elseIfs', elseIfIndex, 'conditionRail'],
                  index,
                  flow
                )
              }}
              onPop={index => {
                this.onPopFlow(['elseIfs', elseIfIndex, 'conditionRail'], index)
              }}
              onUpdate={(index, data) => {
                this.onUpdateFlow(
                  ['elseIfs', elseIfIndex, 'conditionRail'],
                  index,
                  data
                )
              }}
              onRun={null}
            />
            <div className="row">
              <div className="col">
                <h4>Then</h4>
              </div>
            </div>
            <Rail
              rail={item.executeRail}
              runIndex={item.executeRunIndex}
              flows={this.props.flows}
              userFlows={this.props.userFlows}
              onPush={(index, flow) => {
                this.onPushFlow(
                  ['elseIfs', elseIfIndex, 'executeRail'],
                  index,
                  flow
                )
              }}
              onPop={index => {
                this.onPopFlow(['elseIfs', elseIfIndex, 'executeRail'], index)
              }}
              onUpdate={(index, data) => {
                this.onUpdateFlow(
                  ['elseIfs', elseIfIndex, 'executeRail'],
                  index,
                  data
                )
              }}
              onRun={null}
            />
          </React.Fragment>
        ))}
        {this.state.else && (
          <React.Fragment key={'else'}>
            <FlowHeader
              title="Else"
              clients={clients}
              isRunning={isRunning}
              onRun={onRun}
              onDelete={this.onRemoveElse}
            />
            <Rail
              rail={this.state.else.executeRail}
              runIndex={this.state.else.executeRunIndex}
              flows={this.props.flows}
              userFlows={this.props.userFlows}
              onPush={(index, flow) => {
                this.onPushFlow(['else', 'executeRail'], index, flow)
              }}
              onPop={index => {
                this.onPopFlow(['else', 'executeRail'], index)
              }}
              onUpdate={(index, data) => {
                this.onUpdateFlow(['else', 'executeRail'], index, data)
              }}
              onRun={null}
            />
          </React.Fragment>
        )}
        <div className="row">
          <div className="col">
            <h4>Endif</h4>
          </div>
          <div className="d-block col-auto">
            <div
              className="btn-toolbar"
              role="toolbar"
              aria-label="flow if actions"
            >
              <div className="btn-group-sm" role="group">
                {this.state.else === null && (
                  <button
                    type="button"
                    onClick={this.onAddElse}
                    className="btn btn-info"
                  >
                    Add Else
                  </button>
                )}
                <button
                  type="button"
                  onClick={this.onAddElseIf}
                  className="btn btn-info"
                >
                  Add Else If
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default IfFlow
