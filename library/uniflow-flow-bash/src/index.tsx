import React, { Component } from 'react'
import { Ace, FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import { onCode } from './runner'
import {
  setBusEvents,
  componentDidMount,
  componentWillUnmount,
  componentDidUpdate,
  onUpdate,
  onDelete,
} from '@uniflow-io/uniflow-client/src/utils/flow'

class BashFlow extends Component {
  state = {
    isRunning: false,
    bash: null,
  }

  constructor(props) {
    super(props)

    setBusEvents(
      {
        deserialize: this.deserialize,
        code: onCode.bind(this),
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
    return this.state.bash
  }

  deserialize = data => {
    this.setState({ bash: data })
  }

  onChangeBash = bash => {
    this.setState({ bash: bash }, onUpdate(this))
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'clients' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { clients, onRun } = this.props
    const { isRunning, bash } = this.state

    return (
      <>
        <FlowHeader
          title="Bash"
          clients={clients}
          isRunning={isRunning}
          onRun={onRun}
          onDelete={onDelete(this)}
        />
        <form className="form-sm-horizontal">
          <div className="row mb-3">
            <label htmlFor="bash{{ _uid }}" className="col-sm-2 col-form-label">
              Bash
            </label>

            <div className="col-sm-10">
              <Ace
                // @ts-expect-error ts-migrate(2322) FIXME: Type '{ className: string; id: string; value: any;... Remove this comment to see the full error message
                className="form-control"
                id="bash{{ _uid }}"
                value={bash}
                onChange={this.onChangeBash}
                placeholder="Bash"
                height="200"
                mode="batchfile"
              />
            </div>
          </div>
        </form>
      </>
    )
  }
}

export default BashFlow
