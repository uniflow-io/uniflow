import React, { Component } from 'react'
import { onCompile, onExecute} from '../clients/uniflow'
import { uniflow } from '../package'
import { Select2Component } from 'uniflow/src/components'

export default class YamlComponent extends Component {
    state = {
        running: false,
        variable: null,
        keyvaluevariable: null,
        type: null
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
        return [this.state.variable, this.state.keyvaluevariable, this.state.type]
    }

    deserialise = data => {
        let [variable, keyvaluevariable, type] = data || [null, null, null]

        this.setState({ variable: variable, keyvaluevariable: keyvaluevariable, type: type })
    }

    onChangeVariable = event => {
        this.setState({ variable: event.target.value }, this.onUpdate)
    }

    onChangeKeyvaluevariable = event => {
        this.setState({ keyvaluevariable: event.target.value }, this.onUpdate)
    }

    onChangeType = type => {
        this.setState({ type: type }, this.onUpdate)
    }

    onUpdate = () => {
        this.props.onUpdate(this.serialise())
    }

    onDelete = event => {
        event.preventDefault()

        this.props.onPop()
    }

    render () {
        const { running, variable, keyvaluevariable, type } = this.state

        return (
          <div className='box box-info'>
            <form className='form-horizontal'>
              <div className='box-header with-border'>
                <h3 className='box-title'><button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin' /> : <i className='fa fa-refresh fa-cog' />}</button> Yaml</h3>
                <div className='box-tools pull-right'>
                  <button className='btn btn-box-tool' onClick={this.onDelete}><i className='fa fa-times' /></button>
                </div>
              </div>
              <div className='box-body'>
                <div className='form-group'>
                  <label htmlFor='variable{{ _uid }}' className='col-sm-2 control-label'>Variable</label>

                  <div className='col-sm-10'>
                    <input id='variable{{ _uid }}' type='text' value={variable || ''}
                      onChange={this.onChangeVariable} className='form-control' />
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='variable{{ _uid }}' className='col-sm-2 control-label'>Keys Values Variable</label>

                  <div className='col-sm-10'>
                    <input id='variable{{ _uid }}' type='text' value={keyvaluevariable || ''}
                      onChange={this.onChangeKeyvaluevariable} className='form-control' />
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='type{{ _uid }}' className='col-sm-2 control-label'>Type</label>

                  <div className='col-sm-10'>
                    <Select2Component
                      value={type}
                      onChange={this.onChangeType}
                      className='form-control'
                      id='type{{ _uid }}'
                      options={[
                        { value: 'read', label: 'Read' },
                        { value: 'write', label: 'Write' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        )
    }
}