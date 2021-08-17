import React, { Component } from 'react'
import { Editor, FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import flow from '@uniflow-io/uniflow-client/src/utils/flow'

class CodeFlow extends Component {
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

  onChangeCode = code => {
    this.setState({ code: code }, flow.onUpdate(this))
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
          onDelete={flow.onDelete(this)}
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
              <Editor
                className="form-control"
                id="code{{ _uid }}"
                value={code}
                onChange={this.onChangeCode}
                placeholder="Code"
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

export default CodeFlow
