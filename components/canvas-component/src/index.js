import React, { Component } from 'react'
import { ICheckBoxComponent } from 'uniflow/src/components'
import { uniflow } from '../package'
import { onCompile, onExecute } from '../clients/uniflow'

export default class CheckBoxesComponent extends Component {
    state = {
      running: false,
      callback: null
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
      return [this.state.callback]
    }

    deserialise = data => {
      let [callback] = data || [null, {}]

      this.setState({ callback: callback })
    }

    onChangeCallback = event => {
      this.setState({ callback: event.target.value }, this.onUpdate)
    }

    onUpdate = () => {
      this.props.onUpdate(this.serialise())
    }

    onDelete = event => {
      event.preventDefault()

      this.props.onPop()
    }

    render () {
      const { running, callback } = this.state

      return (
        <div className='box box-info'>
          <form className='form-horizontal'>
            <div className='box-header with-border'>
              <h3 className='box-title'><button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin' /> : <i className='fa fa-refresh fa-cog' />}</button> Checkboxes</h3>
              <div className='box-tools pull-right'>
                <button className='btn btn-box-tool' onClick={this.onDelete}><i className='fa fa-times' /></button>
              </div>
            </div>
            <div className='box-body'>
              <div className='form-group'>
                <label htmlFor='callback{{ _uid }}' className='col-sm-2 control-label'>Callback</label>

                <div className='col-sm-10'>
                  <input id='callback{{ _uid }}' type='text' value={callback || ''} onChange={this.onChangeCallback} className='form-control' />
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='canvas{{ _uid }}' className='col-sm-2 control-label'>Canvas</label>

                <div className='col-sm-10'>
                  <canvas ref={(canvas) => this.canvas = canvas} id="canvas{{ _uid }}" width="100%" height="500px"/>
                </div>
              </div>
            </div>
          </form>
        </div>
      )
    }
}
