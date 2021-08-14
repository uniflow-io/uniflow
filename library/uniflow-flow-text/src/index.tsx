import React, { Component } from 'react'
import { Ace, FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import { onCode, onExecute } from './runner'
import {
  setBusEvents,
  componentDidMount,
  componentWillUnmount,
  componentDidUpdate,
  onExecuteHelper,
  onUpdate,
  onDelete,
} from '@uniflow-io/uniflow-client/src/utils/flow'

class TextFlow extends Component {
  state = {
    isRunning: false,
    variable: null,
    text: null,
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
    return [this.state.variable, this.state.text]
  }

  deserialize = data => {
    let [variable, text] = data || [null, null]

    this.setState({ variable: variable, text: text })
  }

  onChangeVariable = event => {
    this.setState({ variable: event.target.value }, onUpdate(this))
  }

  onChangeText = text => {
    this.setState({ text: text }, onUpdate(this))
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'clients' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { clients, onRun } = this.props
    const { isRunning, variable, text } = this.state

    return (
      <>
        <FlowHeader
          title="Text"
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
            <label htmlFor="text{{ _uid }}" className="col-sm-2 col-form-label">
              Text
            </label>

            <div className="col-sm-10">
              <Ace
                // @ts-expect-error ts-migrate(2322) FIXME: Type '{ className: string; id: string; value: any;... Remove this comment to see the full error message
                className="form-control"
                id="text{{ _uid }}"
                value={text}
                onChange={this.onChangeText}
                placeholder="Text"
                height="200"
              />
            </div>
          </div>
        </form>
      </>
    )
  }
}

export default TextFlow
