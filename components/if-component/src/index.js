import React, { Component } from 'react'
import { uniflow } from '../package'
import { onCompile, onExecute } from '../clients/uniflow'
import { ListComponent } from 'uniflow/src/components'
import createStore from 'uniflow/src/utils/createStore'
import flow from 'uniflow/src/reducers/rail'
import {
  commitPushFlow,
  commitPopFlow,
  commitUpdateFlow
} from 'uniflow/src/reducers/rail/actions'

export default class IfComponent extends Component {
    state = {
      running: false,
      if: {
        conditionStack: [],
        conditionRunIndex: null,
        executeStack: [],
        executeRunIndex: null
      },
      elseIfs: [],
      else: null
    }

    constructor (props) {
      super(props)

      this.store = {
        if: {
          conditionStack: [],
          executeStack: []
        },
        elseIfs: [],
        else: null
      }
    }

    static tags() {
        return uniflow.tags
    }

    static clients() {
        return uniflow.clients
    }

    componentDidMount () {
      const { bus } = this.props

      bus.on('reset', this.deserialise)
      bus.on('compile', onCompile.bind(this))
      bus.on('execute', onExecute.bind(this))
    }

    componentWillUnmount () {
      const { bus } = this.props

      bus.off('reset', this.deserialise)
      bus.off('compile', onCompile.bind(this))
      bus.off('execute', onExecute.bind(this))
    }

    componentWillReceiveProps (nextProps) {
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
      return {
        if: {
          condition: this.state.if.conditionStack.map(item => {
            return {
              component: item.component,
              data: item.data
            }
          }),
          execute: this.state.if.executeStack.map(item => {
            return {
              component: item.component,
              data: item.data
            }
          })
        },
        elseIfs: this.state.elseIfs.map(elseIf => {
          return {
            condition: elseIf.conditionStack.map(item => {
              return {
                component: item.component,
                data: item.data
              }
            }),
            execute: elseIf.executeStack.map(item => {
              return {
                component: item.component,
                data: item.data
              }
            })
          }
        }),
        else: this.state.else ? this.state.else.executeStack.map(item => {
          return {
            component: item.component,
            data: item.data
          }
        }) : null
      }
    }

    deserialise = data => {
      let createStoreStack = function (stack) {
        return stack.reduce((promise, item, index) => {
          return promise.then(store => {
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
        createStoreStack(data && data.if && data.if.condition ? data.if.condition : []),
        createStoreStack(data && data.if && data.if.execute ? data.if.execute : []),
        data && data.elseIfs ? data.elseIfs.reduce((promise, elseIf) => {
          return promise.then(elseIfs => {
            return Promise.all([
              createStoreStack(elseIf.condition || []),
              createStoreStack(elseIf.execute || [])
            ]).then(([conditionStack, executeStack]) => {
              elseIfs.push({
                conditionStack: conditionStack,
                executeStack: executeStack
              })
              return elseIfs
            })
          })
        }, Promise.resolve([])) : [],
        data && data.else ? createStoreStack(data.else || []) : null
      ]).then(([ifConditionStack, ifExecuteStack, elseIfsStack, elseStack]) => {
        this.store = {
          if: {
            conditionStack: ifConditionStack,
            executeStack: ifExecuteStack
          },
          elseIfs: elseIfsStack,
          else: elseStack ? {
            executeStack: elseStack
          } : null
        }

        let state = {
          if: {
            conditionStack: this.store.if.conditionStack.getState(),
            conditionRunIndex: null,
            executeStack: this.store.if.executeStack.getState(),
            executeRunIndex: null
          },
          elseIfs: [],
          else: null
        }

        this.store.elseIfs.forEach(elseIf => {
          state.elseIfs.push({
            conditionStack: elseIf.conditionStack.getState(),
            conditionRunIndex: null,
            executeStack: elseIf.executeStack.getState(),
            executeRunIndex: null
          })
        })

        if (this.store.else) {
          state.else = {
            executeStack: this.store.else.executeStack.getState(),
            executeRunIndex: null
          }
        }

        return new Promise(resolve => {
          this.setState(state, resolve)
        }).then(() => {
          return state
        })
      }).then(state => {
        let resetStack = stack => {
          for (let i = 0; i < stack.length; i++) {
            let item = stack[i]
            item.bus.emit('reset', item.data)
          }
        }

        resetStack(state.if.conditionStack)
        resetStack(state.if.executeStack)
        state.elseIfs.forEach(elseIf => {
          resetStack(elseIf.conditionStack)
          resetStack(elseIf.executeStack)
        })
        if (state.else) {
          resetStack(state.else.executeStack)
        }
      })
    }

    dispatchFlow = (propertyPath, action) => {
      let store = this.store
      propertyPath.forEach(key => {
        store = store[key]
      })

      return store.dispatch(action)
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

      this.store.elseIfs.splice(index, 1)

      let elseIfs = this.state.elseIfs.slice()
      elseIfs.splice(index, 1)
      this.setState({ elseIfs: elseIfs }, this.onUpdate)
    }

    onAddElseIf = event => {
      event.preventDefault()

      this.store.elseIfs.push({
        conditionStack: createStore(flow),
        executeStack: createStore(flow)
      })

      let elseIfs = this.state.elseIfs.slice()
      elseIfs.push({
        conditionStack: [],
        conditionRunIndex: null,
        executeStack: [],
        executeRunIndex: null
      })
      this.setState({ elseIfs: elseIfs }, this.onUpdate)
    }

    onRemoveElse = event => {
      event.preventDefault()

      this.store.else = null

      this.setState({ else: null }, this.onUpdate)
    }

    onAddElse = event => {
      event.preventDefault()

      this.store.else = {
        executeStack: createStore(flow)
      }

      this.setState({ else: {
        executeStack: [],
        executeRunIndex: null
      } }, this.onUpdate)
    }

    onUpdate = () => {
      this.props.onUpdate(this.serialise())
    }

    onDelete = event => {
      event.preventDefault()

      this.props.onPop()
    }

    render () {
      return (
        <div>
          <div className='box box-info'>
            <form className='form-horizontal'>
              <div className='box-header with-border'>
                <h3 className='box-title'><button type='submit' className='btn btn-default'>{this.state.running ? <i className='fa fa-refresh fa-spin' /> : <i className='fa fa-refresh fa-cog' />}</button> If</h3>
                <div className='box-tools pull-right'>
                  <button className='btn btn-box-tool' onClick={this.onDelete}><i className='fa fa-times' /></button>
                </div>
              </div>
            </form>
          </div>
          <ListComponent stack={this.state.if.conditionStack} runIndex={this.state.if.conditionRunIndex}
            components={this.props.components}
            userComponents={this.props.userComponents}
            onPush={(index, component) => { this.onPushFlow(['if', 'conditionStack'], index, component) }}
            onPop={index => { this.onPopFlow(['if', 'conditionStack'], index) }}
            onUpdate={(index, data) => { this.onUpdateFlow(['if', 'conditionStack'], index, data) }}
            onRun={null} />
          <div className='box box-info'>
            <form className='form-horizontal'>
              <div className='box-header with-border'>
                <h3 className='box-title'>Then</h3>
              </div>
            </form>
          </div>
          <ListComponent stack={this.state.if.executeStack} runIndex={this.state.if.executeRunIndex}
            components={this.props.components}
            userComponents={this.props.userComponents}
            onPush={(index, component) => { this.onPushFlow(['if', 'executeStack'], index, component) }}
            onPop={index => { this.onPopFlow(['if', 'executeStack'], index) }}
            onUpdate={(index, data) => { this.onUpdateFlow(['if', 'executeStack'], index, data) }}
            onRun={null} />
          {this.state.elseIfs.map((item, elseIfIndex) => (
            <div key={('elseIf' + elseIfIndex)}>
              <div className='box box-info'>
                <form className='form-horizontal'>
                  <div className='box-header with-border'>
                    <h3 className='box-title'>Else If</h3>
                    <div className='box-tools pull-right'>
                      <button className='btn btn-box-tool' onClick={(event, index) => {
                        this.onRemoveElseIf(event, index)
                      }}><i className='fa fa-times' /></button>
                    </div>
                  </div>
                </form>
              </div>
              <ListComponent stack={item.conditionStack} runIndex={item.conditionRunIndex}
                components={this.props.components}
                userComponents={this.props.userComponents}
                onPush={(index, component) => { this.onPushFlow(['elseIfs', elseIfIndex, 'conditionStack'], index, component) }}
                onPop={index => { this.onPopFlow(['elseIfs', elseIfIndex, 'conditionStack'], index) }}
                onUpdate={(index, data) => { this.onUpdateFlow(['elseIfs', elseIfIndex, 'conditionStack'], index, data) }}
                onRun={null} />
              <div className='box box-info'>
                <form className='form-horizontal'>
                  <div className='box-header with-border'>
                    <h3 className='box-title'>Then</h3>
                  </div>
                </form>
              </div>
              <ListComponent stack={item.executeStack} runIndex={item.executeRunIndex}
                components={this.props.components}
                userComponents={this.props.userComponents}
                onPush={(index, component) => { this.onPushFlow(['elseIfs', elseIfIndex, 'executeStack'], index, component) }}
                onPop={index => { this.onPopFlow(['elseIfs', elseIfIndex, 'executeStack'], index) }}
                onUpdate={(index, data) => { this.onUpdateFlow(['elseIfs', elseIfIndex, 'executeStack'], index, data) }}
                onRun={null} />

            </div>
          ))}
          {this.state.else && (
            <div key={'else'}>
              <div className='box box-info'>
                <form className='form-horizontal'>
                  <div className='box-header with-border'>
                    <h3 className='box-title'>Else</h3>
                    <div className='box-tools pull-right'>
                      <button className='btn btn-box-tool' onClick={this.onRemoveElse}><i className='fa fa-times' /></button>
                    </div>
                  </div>
                </form>
              </div>
              <ListComponent stack={this.state.else.executeStack} runIndex={this.state.else.executeRunIndex}
                components={this.props.components}
                userComponents={this.props.userComponents}
                onPush={(index, component) => { this.onPushFlow(['else', 'executeStack'], index, component) }}
                onPop={index => { this.onPopFlow(['else', 'executeStack'], index) }}
                onUpdate={(index, data) => { this.onUpdateFlow(['else', 'executeStack'], index, data) }}
                onRun={null} />
            </div>
          )}
          <div className='box box-info'>
            <form className='form-horizontal'>
              <div className='box-header with-border'>
                <h3 className='box-title'>Endif</h3>
                {this.state.else === null && (
                  <button type='submit' onClick={this.onAddElse} className='btn btn-info pull-right'>
                                Add Else
                  </button>
                )}
                <button type='submit' onClick={this.onAddElseIf} className='btn btn-info pull-right'>
                                Add Else If
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }
}
