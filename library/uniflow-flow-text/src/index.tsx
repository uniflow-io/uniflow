import React, { Component } from 'react'
import { Ace, FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import {
  onUpdate,
  onDelete,
} from '@uniflow-io/uniflow-client/src/utils/flow'

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
    this.setState({ text: text }, onUpdate(this))
  }

  render() {
    const { clients, onRun } = this.props
    const { isRunning, text } = this.state

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
            <label htmlFor="text{{ _uid }}" className="col-sm-2 col-form-label">
              Text
            </label>

            <div className="col-sm-10">
              <Ace
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
