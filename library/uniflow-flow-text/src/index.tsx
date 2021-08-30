import React, { Component } from 'react'
import { Editor, FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import Container from '@uniflow-io/uniflow-client/src/container'
import Flow from '@uniflow-io/uniflow-client/src/services/flow'

const container = new Container()
const flow = container.get(Flow)

class TextFlow extends Component {
  state = {
    isRunning: false,
    text: null,
  }

  serialize = () => {
    return [this.state.text]
  }

  deserialize = data => {
    let [text] = data || [null]

    this.setState({ text: text })
  }

  onChangeText = text => {
    this.setState({ text: text }, flow.onUpdate(this))
  }

  render() {
    const { clients, onPlay } = this.props
    const { isRunning, text } = this.state

    return (
      <>
        <FlowHeader
          title="Text"
          clients={clients}
          isRunning={isRunning}
          onPlay={onPlay}
          onDelete={flow.onDelete(this)}
        />
        <form className="form-sm-horizontal">
          <div className="row mb-3">
            <label htmlFor="text{{ _uid }}" className="col-sm-2 col-form-label">
              Text
            </label>

            <div className="col-sm-10">
              <Editor
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
