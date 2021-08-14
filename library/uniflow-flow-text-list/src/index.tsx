import React, { Component } from 'react'
import { onCode, onExecute } from './runner'
import { FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import {
  setBusEvents,
  componentDidMount,
  componentWillUnmount,
  componentDidUpdate,
  onExecuteHelper,
  onUpdate,
  onDelete,
} from '@uniflow-io/uniflow-client/src/utils/flow'
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class TextListFlow extends Component {
  state = {
    isRunning: false,
    variable: null,
    textList: [],
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

  serialize = () => {
    return [this.state.variable, this.state.textList]
  }

  deserialize = data => {
    let [variable, textList] = data || [null, []]

    this.setState({ variable: variable, textList: textList })
  }

  onChangeVariable = event => {
    this.setState({ variable: event.target.value }, onUpdate(this))
  }

  onAddText = event => {
    event.preventDefault()

    let newStateTextlists = this.state.textList.slice()
    newStateTextlists.push('')
    this.setState({ textList: newStateTextlists }, onUpdate(this))
  }

  onUpdateText = (event, index) => {
    this.setState(
      {
        textList: this.state.textList.map((value, i) => {
          if (i !== index) {
            return value
          }

          return event.target.value
        }),
      },
      onUpdate(this)
    )
  }

  onRemoveText = (event, index) => {
    let newStateTextlists = this.state.textList.slice()
    newStateTextlists.splice(index, 1)
    this.setState({ textList: newStateTextlists }, onUpdate(this))
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'clients' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { clients, onRun } = this.props
    const { isRunning, variable, textList } = this.state

    return (
      <>
        <FlowHeader
          title="Text List"
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

          {textList.map((value, index) => (
            <div key={index} className="row">
              <div className="col-sm-10 offset-sm-2">
                <div className="input-group">
                  <input
                    type="text"
                    value={textList[index]}
                    onChange={event => this.onUpdateText(event, index)}
                    className="form-control"
                    placeholder="value"
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="input-group-text"
                      onClick={event => {
                        this.onRemoveText(event, index)
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="row mb-3">
            <div className="col-auto ml-auto">
              <div
                className="btn-toolbar"
                role="toolbar"
                aria-label="flow text-list actions"
              >
                <div className="btn-group" role="group">
                  <button
                    type="submit"
                    onClick={this.onAddText}
                    className="btn btn-info"
                  >
                    Add Text
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    )
  }
}

export default TextListFlow
