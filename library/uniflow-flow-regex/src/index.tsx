import React, { Component } from 'react'
import { Ace, FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import { onCode, onExecute } from './runner'
import SRL from 'srl'
import {
  setBusEvents,
  componentDidMount,
  componentWillUnmount,
  componentDidUpdate,
  onExecuteHelper,
  onUpdate,
  onDelete,
} from '@uniflow-io/uniflow-client/src/utils/flow'
import {faClipboard} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function copyTextToClipboard(text) {
  let textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
  } catch (err) {}

  document.body.removeChild(textArea)
}

class RegexFlow extends Component {
  state = {
    isRunning: false,
    variable: null,
    expression: null,
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
    return [this.state.variable, this.state.expression]
  }

  deserialize = data => {
    let [variable, expression] = data || [null, null]

    this.setState({ variable: variable, expression: expression })
  }

  onChangeVariable = event => {
    this.setState({ variable: event.target.value }, onUpdate(this))
  }

  onChangeExpression = expression => {
    this.setState({ expression: expression }, onUpdate(this))
  }

  getGenerated = () => {
    const { expression } = this.state

    try {
      let builder = new SRL(expression)
      return builder.get()
    } catch (e) {
      return e.message
    }
  }

  onCopyGenerated = event => {
    const generated = this.getGenerated()

    copyTextToClipboard(generated)
  }

  render() {
    const { clients, onRun } = this.props
    const { isRunning, variable, expression } = this.state

    return (
      <>
        <FlowHeader
          title="Regex"
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

          <div className="row mb-3">
            <div className="offset-md-2 col-sm-10">
              <a
                href="https://simple-regex.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                SRL - Simple Regex Language
              </a>
            </div>
          </div>

          <div className="row mb-3">
            <label
              htmlFor="expression{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Expression
            </label>

            <div className="col-sm-10">
              <Ace
                className="form-control"
                id="expression{{ _uid }}"
                value={expression}
                onChange={this.onChangeExpression}
                placeholder="Expression"
                height="200"
              />
            </div>
          </div>

          <div className="row mb-3">
            <label
              htmlFor="generated{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Generated
            </label>
            <div className="col-sm-10">
              <div className="input-group">
                <div className="input-group-prepend">
                  <button
                    type="button"
                    className="input-group-text"
                    onClick={this.onCopyGenerated}
                  >
                    <FontAwesomeIcon icon={faClipboard} />
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="generated{{ _uid }}"
                  value={this.getGenerated()}
                  readOnly
                  placeholder="Generated"
                />
              </div>
            </div>
          </div>
        </form>
      </>
    )
  }
}

export default RegexFlow
