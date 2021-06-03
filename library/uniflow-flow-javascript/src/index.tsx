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

class JavascriptFlow extends Component {
  state = {
    isRunning: false,
    javascript: null,
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
    return this.state.javascript
  }

  deserialize = data => {
    this.setState({ javascript: data })
  }

  onChangeJavascript = javascript => {
    this.setState({ javascript: javascript }, onUpdate(this))
  }

  render() {
    const { clients, onRun } = this.props
    const { isRunning, javascript } = this.state

    return (
      <>
        <FlowHeader
          title="Javascript"
          clients={clients}
          isRunning={isRunning}
          onRun={onRun}
          onDelete={onDelete(this)}
        />
        <form className="form-sm-horizontal">
          <div className="form-group row">
            <label
              htmlFor="javascript{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Javascript
            </label>

            <div className="col-sm-10">
              <Ace
                className="form-control"
                id="javascript{{ _uid }}"
                value={javascript}
                onChange={this.onChangeJavascript}
                placeholder="Javascript"
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

export default JavascriptFlow
