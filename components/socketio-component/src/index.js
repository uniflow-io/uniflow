import React, { Component } from 'react'
import { uniflow } from '../package'
import { onCompile, onExecute} from '../clients/uniflow'

export default class SocketIOComponent extends Component {
    state = {
      running: false,
      variable: null,
      host: null,
      port: null
    }

    static tags() {
        return uniflow.tags
    }

    static clients() {
        return uniflow.clients
    }

    componentDidMount () {
      const { bus } = this.props

      bus.on('reset', this.deserialise)
      bus.on('compile', onCompile.bind(this))
      bus.on('execute', onExecute.bind(this))
    }

    componentWillUnmount () {
      const { bus } = this.props

      bus.off('reset', this.deserialise)
      bus.off('compile', onCompile.bind(this))
      bus.off('execute', onExecute.bind(this))
    }

    componentWillReceiveProps (nextProps) {
      const oldProps = this.props

      if (nextProps.bus !== oldProps.bus) {
        oldProps.bus.off('reset', this.deserialise)
        oldProps.bus.off('compile', onCompile.bind(this))
        oldProps.bus.off('execute', onExecute.bind(this))

        nextProps.bus.on('reset', this.deserialise)
        nextProps.bus.on('compile', onCompile.bind(this))
        nextProps.bus.on('execute', onExecute.bind(this))
      }
    }

    serialise = () => {
      return [this.state.variable, this.state.host, this.state.port]
    }

    deserialise = data => {
      let [variable, host, port] = data || [null, null, null]

      this.setState({ variable: variable, host: host, port: port })
    }

    onChangeVariable = event => {
      this.setState({ variable: event.target.value }, this.onUpdate)
    }

    onChangeHost = event => {
      this.setState({ host: event.target.value }, this.onUpdate)
    }

    onChangePort = event => {
      this.setState({ port: event.target.value }, this.onUpdate)
    }

    onUpdate = () => {
      this.props.onUpdate(this.serialise())
    }

    onDelete = event => {
      event.preventDefault()

      this.props.onPop()
    }

    render () {
      const { running, variable, host, port } = this.state

      return (
        <div className='box box-info'>
          <form className='form-horizontal'>
            <div className='box-header with-border'>
              <h3 className='box-title'><button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin' /> : <i className='fa fa-refresh fa-cog' />}</button> Socket IO</h3>
              <div className='box-tools pull-right'>
                <button className='btn btn-box-tool' onClick={this.onDelete}><i className='fa fa-times' /></button>
              </div>
            </div>
            <div className='box-body'>
              <div className='form-group'>
                <label htmlFor='variable{{ _uid }}' className='col-sm-2 control-label'>Variable</label>

                <div className='col-sm-10'>
                  <input id='variable{{ _uid }}' type='text' value={variable || ''} onChange={this.onChangeVariable} className='form-control' />
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='host{{ _uid }}' className='col-sm-2 control-label'>Host</label>

                <div className='col-sm-10'>
                  <input id='host{{ _uid }}' type='text' value={host || ''} onChange={this.onChangeHost} className='form-control' />
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='port{{ _uid }}' className='col-sm-2 control-label'>Port</label>

                <div className='col-sm-10'>
                  <input id='port{{ _uid }}' type='text' value={port || ''} onChange={this.onChangePort} className='form-control' />
                </div>
              </div>
            </div>
          </form>
        </div>
      )
    }
}
