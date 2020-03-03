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

class CanvasFlow extends Component {
  state = {
    isRunning: false,
    variable: null,
    width: null,
    height: null,
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
    return [this.state.variable, this.state.width, this.state.height]
  }

  deserialize = data => {
    let [variable, width, height] = data || [null, null, null]

    this.setState({ variable: variable, width: width, height: height })
  }

  onChangeVariable = event => {
    this.setState({ variable: event.target.value }, this.onUpdate)
  }

  onChangeWidth = event => {
    this.setState({ width: event.target.value }, this.onUpdate)
  }

  onChangeHeight = event => {
    this.setState({ height: event.target.value }, this.onUpdate)
  }

  onUpdate = () => {
    onUpdate(this)
  }

  render() {
    const { clients, onRun } = this.props
    const { isRunning, variable, width, height } = this.state

    return (
      <>
        <FlowHeader
          title="Canvas"
          clients={clients}
          isRunning={isRunning}
          onRun={onRun}
          onDelete={onDelete(this)}
        />
        <form className="form-sm-horizontal">
          <div className="form-group row">
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

          <div className="form-group row">
            <label
              htmlFor="width{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Width
            </label>

            <div className="col-sm-10">
              <input
                id="width{{ _uid }}"
                type="text"
                value={width || ''}
                onChange={this.onChangeWidth}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group row">
            <label
              htmlFor="height{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Height
            </label>

            <div className="col-sm-10">
              <input
                id="height{{ _uid }}"
                type="text"
                value={height || ''}
                onChange={this.onChangeHeight}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group row">
            <label
              htmlFor="canvas{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Canvas
            </label>

            <div className="col-sm-10">
              <canvas
                ref={canvas => (this.canvas = canvas)}
                id="canvas{{ _uid }}"
                width={width}
                height={height}
              />
            </div>
          </div>
        </form>
      </>
    )
  }
}

export default CanvasFlow
