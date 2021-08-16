import React, { Component } from 'react'
import { onCode, onExecute } from './runner'
import { Ace, FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import {
  setBusEvents,
  componentDidMount,
  componentWillUnmount,
  componentDidUpdate,
  onExecuteHelper,
  onUpdate,
  onDelete,
} from '@uniflow-io/uniflow-client/src/utils/flow'

class CodeFlow extends Component {
  state = {
    isRunning: false,
    code: null,
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
    return this.state.code
  }

  deserialize = data => {
    this.setState({ code: data })
  }

  onChangeCode = code => {
    this.setState({ code: code }, onUpdate(this))
  }

  render() {
    const { clients, onRun } = this.props
    const { isRunning, code } = this.state

    return (
      <>
        <FlowHeader
          title="Code"
          clients={clients}
          isRunning={isRunning}
          onRun={onRun}
          onDelete={onDelete(this)}
        />
        <form className="form-sm-horizontal">
          <div className="row mb-3">
            <label
              htmlFor="code{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Code
            </label>

            <div className="col-sm-10">
              <Ace
                className="form-control"
                id="code{{ _uid }}"
                value={code}
                onChange={this.onChangeCode}
                placeholder="Code"
                height="200"
                mode="javascript"
              />
            </div>
          </div>
        </form>
      </>
    )
  }
}

export default CodeFlow
