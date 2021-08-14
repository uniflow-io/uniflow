import React, { Component } from 'react'
import PropertyAccessor from 'property-accessor'
import { onCode, onExecute } from './runner'
import { FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  setBusEvents,
  componentDidMount,
  componentWillUnmount,
  componentDidUpdate,
  onExecuteHelper,
  onUpdate,
  onDelete,
} from '@uniflow-io/uniflow-client/src/utils/flow'

class ObjectFlow extends Component {
  state = {
    isRunning: false,
    variable: null,
    keyValueList: [],
  }

  constructor(props) {
    super(props)

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

  transform = () => {
    return this.state.keyValueList.reduce(function(object, item) {
      if (item.key) {
        let value = item.value
        if (/^[0-9]+$/.test(value)) {
          value = Number.parseInt(value)
        }

        try {
          let accessor = new PropertyAccessor(object)
          accessor.set(item.key, value)
        } catch (e) {}
      }
      return object
    }, {})
  }

  reverseTransform = object => {
    let flatten = function(data, accessors = []) {
      return Object.entries(data).reduce(function(list, item) {
        if (typeof item[1] === 'object') {
          list = list.concat(flatten(item[1], accessors.concat([item[0]])))
        } else {
          let key = item[0]
          for (let i = accessors.length - 1; i >= 0; i--) {
            if (key[0] !== '[') {
              key = '.' + key
            }

            if (/^[0-9]+$/.test(accessors[i])) {
              key = '[' + accessors[i] + ']' + key
            } else {
              key = accessors[i] + key
            }
          }
          list.push({ key: key, value: item[1] })
        }
        return list
      }, [])
    }

    return flatten(object)
  }

  serialize = () => {
    let object = this.transform()
    return [this.state.variable, object]
  }

  deserialize = data => {
    let [variable, object] = data || [null, {}]
    let keyValueList = this.reverseTransform(object)

    this.setState({ variable: variable, keyValueList: keyValueList })
  }

  onChangeVariable = event => {
    this.setState({ variable: event.target.value }, onUpdate(this))
  }

  onUpdateItemKey = (event, index) => {
    this.setState(
      {
        keyValueList: this.state.keyValueList.map((item, i) => {
          if (i !== index) {
            return item
          }

          return {
            ...item,
            ...{ key: event.target.value },
          }
        }),
      },
      onUpdate(this)
    )
  }

  onUpdateItemValue = (event, index) => {
    this.setState(
      {
        keyValueList: this.state.keyValueList.map((item, i) => {
          if (i !== index) {
            return item
          }

          return {
            ...item,
            ...{ value: event.target.value },
          }
        }),
      },
      onUpdate(this)
    )
  }

  onRemoveItem = (event, index) => {
    event.preventDefault()

    let keyValueList = this.state.keyValueList.slice()
    keyValueList.splice(index, 1)
    this.setState({ keyValueList: keyValueList }, onUpdate(this))
  }

  onAddItem = event => {
    event.preventDefault()

    let keyValueList = this.state.keyValueList.slice()
    keyValueList.push({ key: '', value: '' })
    this.setState({ keyValueList: keyValueList }, onUpdate(this))
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'clients' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { clients, onRun } = this.props
    const { isRunning, variable, keyValueList } = this.state

    return (
      <>
        <FlowHeader
          title="Object"
          clients={clients}
          isRunning={isRunning}
          onRun={onRun}
          onDelete={onDelete(this)}
        />
        <form className="form-sm-horizontal">
          <div className="row mb-3">
            <label
              htmlFor="variable{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Variable
            </label>

            <div className="col-sm-10">
              <input
                id="variable{{ _uid }}"
                type="text"
                value={variable || ''}
                onChange={this.onChangeVariable}
                className="form-control"
              />
            </div>
          </div>

          {keyValueList.map((item, index) => (
            <div className="row" key={index}>
              <div className="col-sm-4 offset-sm-2">
                <input
                  type="text"
                  value={keyValueList[index].key}
                  onChange={event => this.onUpdateItemKey(event, index)}
                  className="form-control"
                  placeholder="key"
                />
              </div>
              <div className="col-sm-6">
                <div className="input-group">
                  <input
                    type="text"
                    value={keyValueList[index].value}
                    onChange={event => this.onUpdateItemValue(event, index)}
                    className="form-control"
                    placeholder="value"
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="input-group-text"
                      onClick={event => {
                        this.onRemoveItem(event, index)
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </form>
        <div className="row mb-3">
          <div className="col-auto ml-auto">
            <button
              type="submit"
              onClick={this.onAddItem}
              className="btn btn-info"
            >
              Add Item
            </button>
          </div>
        </div>
      </>
    )
  }
}

export default ObjectFlow
