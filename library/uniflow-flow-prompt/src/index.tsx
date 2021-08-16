import React, { Component } from 'react'
import { Ace, FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import { Select } from '@uniflow-io/uniflow-client/src/components'
import {
  onUpdate,
  onDelete,
} from '@uniflow-io/uniflow-client/src/utils/flow'

class PromptFlow extends Component {
  state = {
    isRunning: false,
    variable: null,
    messageVariable: null,
    type: null,
    promptDisplay: false,
    message: null,
    input: null,
  }

  serialize = () => {
    return [this.state.variable, this.state.messageVariable, this.state.type]
  }

  deserialize = data => {
    let [variable, messageVariable, type] = data || [null, null, null]

    this.setState({
      variable: variable,
      messageVariable: messageVariable,
      type: type,
    })
  }

  onChangeVariable = event => {
    this.setState({ variable: event.target.value }, onUpdate(this))
  }

  onChangeMessageVariable = event => {
    this.setState({ messageVariable: event.target.value }, onUpdate(this))
  }

  onChangeType = type => {
    this.setState({ type: type }, onUpdate(this))
  }

  onChangeInputString = event => {
    this.setState({ input: event.target.value })
  }

  onChangeInputText = value => {
    this.setState({ input: value })
  }

  onChangeInputFile = event => {
    event.persist()
    event.preventDefault()

    let file = event.target.files[0]

    return new Promise((resolve, error) => {
      let reader = new FileReader()
      reader.onerror = error
      reader.onload = e => {
        this.setState({ input: e.target.result }, resolve)
      }
      reader.readAsText(file)
    })
  }

  onInputSave = event => {
    event.preventDefault()

    if (this.inputResolve) {
      this.inputResolve()
    }
  }

  render() {
    const { clients, onRun } = this.props
    const {
      isRunning,
      variable,
      messageVariable,
      type,
      promptDisplay,
      message,
      input,
    } = this.state

    const allChoices = {
      string: 'String',
      text: 'Text',
      file: 'File',
    }

    let choices = {},
      clientKeyChoices = []
    if (clients.length === 1 && clients.indexOf('uniflow') !== -1) {
      clientKeyChoices = ['string', 'text', 'file']
    } else if (clients.length === 1 && clients.indexOf('node') !== -1) {
      clientKeyChoices = ['string']
    } else if (
      clients.length === 2 &&
      clients.indexOf('node') !== -1 &&
      clients.indexOf('uniflow') !== -1
    ) {
      clientKeyChoices = ['string']
    }
    choices = clientKeyChoices.reduce(function(value, key) {
      value[key] = allChoices[key]
      return value
    }, choices)

    return (
      <>
        <FlowHeader
          title="Prompt"
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
            <label
              htmlFor="variable{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Message Variable
            </label>

            <div className="col-sm-10">
              <input
                id="variable{{ _uid }}"
                type="text"
                value={messageVariable || ''}
                onChange={this.onChangeMessageVariable}
                className="form-control"
              />
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="type{{ _uid }}" className="col-sm-2 col-form-label">
              Type
            </label>

            <div className="col-sm-10">
              <Select
                value={type}
                onChange={this.onChangeType}
                className="form-control"
                id="type{{ _uid }}"
                options={Object.keys(choices).map(value => {
                  return { value: value, label: choices[value] }
                })}
              />
            </div>
          </div>

          {promptDisplay && message && (
            <div className="row mb-3">
              <div className="offset-md-2 col-sm-10">{message}</div>
            </div>
          )}

          {promptDisplay && type === 'string' && (
            <div className="row mb-3">
              <label
                htmlFor="input_string{{ _uid }}"
                className="col-sm-2 col-form-label"
              >
                Input
              </label>

              <div className="col-sm-10">
                <input
                  id="input_string{{ _uid }}"
                  type="text"
                  value={input || ''}
                  onChange={this.onChangeInputString}
                  className="form-control"
                />
              </div>
            </div>
          )}

          {promptDisplay && type === 'text' && (
            <div className="row mb-3">
              <label
                htmlFor="input_text{{ _uid }}"
                className="col-sm-2 col-form-label"
              >
                Input
              </label>

              <div className="col-sm-10">
                <Ace
                  className="form-control"
                  id="input_text{{ _uid }}"
                  value={input || ''}
                  onChange={this.onChangeInputText}
                  placeholder="Text"
                  height="200"
                />
              </div>
            </div>
          )}

          {promptDisplay && type === 'file' && (
            <div className="row mb-3">
              <label
                htmlFor="input_file{{ _uid }}"
                className="col-sm-2 col-form-label"
              >
                Input
              </label>

              <div className="col-sm-10">
                <input
                  id="input_file{{ _uid }}"
                  type="file"
                  onChange={this.onChangeInputFile}
                  className="form-control"
                />
              </div>
            </div>
          )}
        </form>
        {promptDisplay && (
          <div className="row">
            <div className="d-block col-auto">
              <div
                className="btn-toolbar"
                role="toolbar"
                aria-label="flow object actions"
              >
                <div className="btn-group-sm" role="group">
                  <button
                    type="submit"
                    onClick={this.onInputSave}
                    className="btn btn-info"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
}

export default PromptFlow
