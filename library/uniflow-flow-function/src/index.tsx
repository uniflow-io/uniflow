import React, { Component } from 'react'
import { Editor, FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import Container from '@uniflow-io/uniflow-client/src/container'
import Flow from '@uniflow-io/uniflow-client/src/services/flow'

const container = new Container()
const flow = container.get(Flow)

class FunctionFlow extends Component {
  state = {
    isRunning: false,
    code: null,
  }

  serialize = () => {
    return this.state.code
  }

  deserialize = data => {
    this.setState({ code: data })
  }

  onChangeFunction = (code) => {
    this.setState({ code: code }, flow.onUpdate(this))
  }

  render() {
    const { clients, onRun } = this.props
    const { isRunning, code } = this.state

    return (
      <>
        <FlowHeader
          title="Function"
          clients={clients}
          isRunning={isRunning}
          onRun={onRun}
          onDelete={flow.onDelete(this)}
        />
        <form className="form-sm-horizontal">
          <div className="row mb-3">
            <label
              htmlFor="code{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Function
            </label>

            <div className="col-sm-10">
              <Editor
                className="form-control"
                id="code{{ _uid }}"
                value={code}
                onChange={this.onChangeFunction}
                placeholder="Function"
                height="200"
                language="javascript"
              />
            </div>
          </div>
        </form>
      </>
    )
  }
}

export default FunctionFlow
