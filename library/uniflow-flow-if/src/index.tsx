import React, { Component } from 'react'
import { onCode, onExecute } from './runner'
import { FlowHeader, Flows } from '@uniflow-io/uniflow-client/src/components'
import createStore from '@uniflow-io/uniflow-client/src/utils/create-store'
import flows from '@uniflow-io/uniflow-client/src/reducers/flows'
import {
  commitPushFlow,
  commitPopFlow,
  commitUpdateFlow,
} from '@uniflow-io/uniflow-client/src/reducers/flows/actions'
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
      conditionFlows: [],
      conditionRunIndex: null,
      executeFlows: [],
      executeRunIndex: null,
    },
    elseIfs: [],
    else: null,
  }

  constructor(props) {
    super(props)

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'store' does not exist on type 'IfFlow'.
    this.store = {
      if: {
        conditionFlows: [],
        executeFlows: [],
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
        condition: this.state.if.conditionFlows.map(item => {
          return {
            flow: item.flow,
            data: item.data,
          }
        }),
        execute: this.state.if.executeFlows.map(item => {
          return {
            flow: item.flow,
            data: item.data,
          }
        }),
      },
      elseIfs: this.state.elseIfs.map(elseIf => {
        return {
          condition: elseIf.conditionFlows.map(item => {
            return {
              flow: item.flow,
              data: item.data,
            }
          }),
          execute: elseIf.executeFlows.map(item => {
            return {
              flow: item.flow,
              data: item.data,
            }
          }),
        }
      }),
      else: this.state.else
        ? this.state.else.executeFlows.map(item => {
            return {
              flow: item.flow,
              data: item.data,
            }
          })
        : null,
    }
  }

  deserialize = data => {
    let createStoreFlows = function(flowsStore) {
      return flowsStore.reduce((promise, item, index) => {
        return promise.then(store => {
          return store
            .dispatch(commitPushFlow(index, item.flow))
            .then(() => {
              // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
              return store.dispatch(commitUpdateFlow(index, item.data))
            })
            .then(() => {
              return store
            })
        })
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      }, Promise.resolve(createStore(flows)))
    }

    Promise.all([
      createStoreFlows(
        data && data.if && data.if.condition ? data.if.condition : []
      ),
      createStoreFlows(
        data && data.if && data.if.execute ? data.if.execute : []
      ),
      data && data.elseIfs
        ? data.elseIfs.reduce((promise, elseIf) => {
            return promise.then(elseIfs => {
              return Promise.all([
                createStoreFlows(elseIf.condition || []),
                createStoreFlows(elseIf.execute || []),
              ]).then(([conditionFlows, executeFlows]) => {
                elseIfs.push({
                  conditionFlows: conditionFlows,
                  executeFlows: executeFlows,
                })
                return elseIfs
              })
            })
          }, Promise.resolve([]))
        : [],
      data && data.else ? createStoreFlows(data.else || []) : null,
    ])
      .then(([ifConditionFlows, ifExecuteFlows, elseIfsFlows, elseFlows]) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'store' does not exist on type 'IfFlow'.
        this.store = {
          if: {
            conditionFlows: ifConditionFlows,
            executeFlows: ifExecuteFlows,
          },
          elseIfs: elseIfsFlows,
          else: elseFlows
            ? {
                executeFlows: elseFlows,
              }
            : null,
        }

        let state = {
          if: {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'store' does not exist on type 'IfFlow'.
            conditionFlows: this.store.if.conditionFlows.getState(),
            conditionRunIndex: null,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'store' does not exist on type 'IfFlow'.
            executeFlows: this.store.if.executeFlows.getState(),
            executeRunIndex: null,
          },
          elseIfs: [],
          else: null,
        }

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'store' does not exist on type 'IfFlow'.
        this.store.elseIfs.forEach(elseIf => {
          state.elseIfs.push({
            conditionFlows: elseIf.conditionFlows.getState(),
            conditionRunIndex: null,
            executeFlows: elseIf.executeFlows.getState(),
            executeRunIndex: null,
          })
        })

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'store' does not exist on type 'IfFlow'.
        if (this.store.else) {
          state.else = {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'store' does not exist on type 'IfFlow'.
            executeFlows: this.store.else.executeFlows.getState(),
            executeRunIndex: null,
          }
        }

        return new Promise(resolve => {
          // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(value: unknown) => void' is not... Remove this comment to see the full error message
          this.setState(state, resolve)
        }).then(() => {
          return state
        })
      })
      .then(state => {
        let resetFlows = flows => {
          for (let i = 0; i < flows.length; i++) {
            let item = flows[i]
            item.bus.emit('deserialize', item.data)
          }
        }

        resetFlows(state.if.conditionFlows)
        resetFlows(state.if.executeFlows)
        state.elseIfs.forEach(elseIf => {
          resetFlows(elseIf.conditionFlows)
          resetFlows(elseIf.executeFlows)
        })
        if (state.else) {
          resetFlows(state.else.executeFlows)
        }
      })
  }

  dispatchFlow = (propertyPath, action) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'store' does not exist on type 'IfFlow'.
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
          // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(value: unknown) => void' is not... Remove this comment to see the full error message
          this.setState(state, resolve)
        })
      })
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onUpdate' does not exist on type 'IfFlow... Remove this comment to see the full error message
      .then(this.onUpdate)
  }

  onPushFlow = (propertyPath, index, flow) => {
    this.dispatchFlow(propertyPath, commitPushFlow(index, flow))
  }

  onPopFlow = (propertyPath, index) => {
    this.dispatchFlow(propertyPath, commitPopFlow(index))
  }

  onUpdateFlow = (propertyPath, index, data) => {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
    this.dispatchFlow(propertyPath, commitUpdateFlow(index, data))
  }

  onRemoveElseIf = (event, index) => {
    event.preventDefault()

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'store' does not exist on type 'IfFlow'.
    this.store.elseIfs.splice(index, 1)

    let elseIfs = this.state.elseIfs.slice()
    elseIfs.splice(index, 1)
    this.setState({ elseIfs: elseIfs }, onUpdate(this))
  }

  onAddElseIf = event => {
    event.preventDefault()

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'store' does not exist on type 'IfFlow'.
    this.store.elseIfs.push({
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      conditionFlows: createStore(flows),
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      executeFlows: createStore(flows),
    })

    let elseIfs = this.state.elseIfs.slice()
    elseIfs.push({
      conditionFlows: [],
      conditionRunIndex: null,
      executeFlows: [],
      executeRunIndex: null,
    })
    this.setState({ elseIfs: elseIfs }, onUpdate(this))
  }

  onRemoveElse = event => {
    event.preventDefault()

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'store' does not exist on type 'IfFlow'.
    this.store.else = null

    this.setState({ else: null }, onUpdate(this))
  }

  onAddElse = event => {
    event.preventDefault()

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'store' does not exist on type 'IfFlow'.
    this.store.else = {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      executeFlows: createStore(flows),
    }

    this.setState(
      {
        else: {
          executeFlows: [],
          executeRunIndex: null,
        },
      },
      onUpdate(this)
    )
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'clients' does not exist on type 'Readonl... Remove this comment to see the full error message
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
        <Flows
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          flows={this.state.if.conditionFlows}
          runIndex={this.state.if.conditionRunIndex}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'allFlows' does not exist on type 'Readon... Remove this comment to see the full error message
          allFlows={this.props.allFlows}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'programFlows' does not exist on type 'Re... Remove this comment to see the full error message
          programFlows={this.props.programFlows}
          onPush={(index, flow) => {
            this.onPushFlow(['if', 'conditionFlows'], index, flow)
          }}
          onPop={index => {
            this.onPopFlow(['if', 'conditionFlows'], index)
          }}
          onUpdate={(index, data) => {
            this.onUpdateFlow(['if', 'conditionFlows'], index, data)
          }}
          onRun={null}
        />
        <div className="row">
          <div className="col">
            <h4>Then</h4>
          </div>
        </div>
        <Flows
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          flows={this.state.if.executeFlows}
          runIndex={this.state.if.executeRunIndex}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'allFlows' does not exist on type 'Readon... Remove this comment to see the full error message
          allFlows={this.props.allFlows}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'programFlows' does not exist on type 'Re... Remove this comment to see the full error message
          programFlows={this.props.programFlows}
          onPush={(index, flow) => {
            this.onPushFlow(['if', 'executeFlows'], index, flow)
          }}
          onPop={index => {
            this.onPopFlow(['if', 'executeFlows'], index)
          }}
          onUpdate={(index, data) => {
            this.onUpdateFlow(['if', 'executeFlows'], index, data)
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
            <Flows
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              flows={item.conditionFlows}
              runIndex={item.conditionRunIndex}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'allFlows' does not exist on type 'Readon... Remove this comment to see the full error message
              allFlows={this.props.allFlows}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'programFlows' does not exist on type 'Re... Remove this comment to see the full error message
              programFlows={this.props.programFlows}
              onPush={(index, flow) => {
                this.onPushFlow(
                  ['elseIfs', elseIfIndex, 'conditionFlows'],
                  index,
                  flow
                )
              }}
              onPop={index => {
                this.onPopFlow(['elseIfs', elseIfIndex, 'conditionFlows'], index)
              }}
              onUpdate={(index, data) => {
                this.onUpdateFlow(
                  ['elseIfs', elseIfIndex, 'conditionFlows'],
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
            <Flows
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              flows={item.executeFlows}
              runIndex={item.executeRunIndex}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'allFlows' does not exist on type 'Readon... Remove this comment to see the full error message
              allFlows={this.props.allFlows}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'programFlows' does not exist on type 'Re... Remove this comment to see the full error message
              programFlows={this.props.programFlows}
              onPush={(index, flow) => {
                this.onPushFlow(
                  ['elseIfs', elseIfIndex, 'executeFlows'],
                  index,
                  flow
                )
              }}
              onPop={index => {
                this.onPopFlow(['elseIfs', elseIfIndex, 'executeFlows'], index)
              }}
              onUpdate={(index, data) => {
                this.onUpdateFlow(
                  ['elseIfs', elseIfIndex, 'executeFlows'],
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
            <Flows
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              flows={this.state.else.executeFlows}
              runIndex={this.state.else.executeRunIndex}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'allFlows' does not exist on type 'Readon... Remove this comment to see the full error message
              allFlows={this.props.allFlows}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'programFlows' does not exist on type 'Re... Remove this comment to see the full error message
              programFlows={this.props.programFlows}
              onPush={(index, flow) => {
                this.onPushFlow(['else', 'executeFlows'], index, flow)
              }}
              onPop={index => {
                this.onPopFlow(['else', 'executeFlows'], index)
              }}
              onUpdate={(index, data) => {
                this.onUpdateFlow(['else', 'executeFlows'], index, data)
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
