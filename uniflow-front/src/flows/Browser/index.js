import React, {Component} from 'react'
import {Select2Component} from '../../components'
import {onCode, onExecute} from './runner'

export default class BrowserComponent extends Component {
  state = {
    running: false,
    variable: null,
    host: null,
    ioPort: null,
    proxyPort: null,
    mode: null,
    displayBrowserConnect: false
  }

  static tags() {
    return ['core']
  }

  static clients() {
    return ['uniflow']
  }

  constructor(props) {
    super(props)

    this.resolveBrowserConnected = null
  }

  componentDidMount() {
    const {bus} = this.props
    bus.on('reset', this.deserialise)
    bus.on('code', onCode.bind(this))
    bus.on('execute', onExecute.bind(this))
  }

  componentWillUnmount() {
    const {bus} = this.props
    bus.off('reset', this.deserialise)
    bus.off('code', onCode.bind(this))
    bus.off('execute', onExecute.bind(this))
  }

  componentWillReceiveProps(nextProps) {
    const oldProps = this.props

    if (nextProps.bus !== oldProps.bus) {
      oldProps.bus.off('reset', this.deserialise)
      oldProps.bus.off('code', onCode.bind(this))
      oldProps.bus.off('execute', onExecute.bind(this))

      nextProps.bus.on('reset', this.deserialise)
      nextProps.bus.on('code', onCode.bind(this))
      nextProps.bus.on('execute', onExecute.bind(this))
    }
  }

  serialise = () => {
    return [this.state.variable, this.state.host, this.state.ioPort, this.state.proxyPort, this.state.mode]
  }

  deserialise = data => {
    let [variable, host, ioPort, proxyPort, mode] = data || [null, null, null, null, null]

    this.setState({variable: variable, host: host, ioPort: ioPort, proxyPort: proxyPort, mode: mode})
  }

  onChangeVariable = event => {
    this.setState({variable: event.target.value}, this.onUpdate)
  }

  onChangeHost = event => {
    this.setState({host: event.target.value}, this.onUpdate)
  }

  onChangeIOPort = event => {
    this.setState({ioPort: event.target.value}, this.onUpdate)
  }

  onChangeProxyPort = event => {
    this.setState({proxyPort: event.target.value}, this.onUpdate)
  }

  onChangeMode = mode => {
    this.setState({mode: mode}, this.onUpdate)
  }

  onBrowserConnected = event => {
    event.preventDefault()

    if (this.resolveBrowserConnected) {
      this.resolveBrowserConnected()
    }
  }

  onUpdate = () => {
    this.props.onUpdate(this.serialise())
  }

  onDelete = event => {
    event.preventDefault()

    this.props.onPop()
  }

  render() {
    const {running, variable, host, ioPort, proxyPort, mode} = this.state

    return (
      <div className='box box-info'>
        <form className='form-horizontal'>
          <div className='box-header with-border'>
            <h3 className='box-title'>
              <button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin'/> :
                <i className='fa fa-refresh fa-cog'/>}</button>
              Browser
            </h3>
            <div className='box-tools pull-right'>
              <button className='btn btn-box-tool' onClick={this.onDelete}><i className='fa fa-times'/></button>
            </div>
          </div>
          <div className='box-body'>
            <div className='form-group'>
              <label htmlFor='variable{{ _uid }}' className='col-sm-2 control-label'>Variable</label>

              <div className='col-sm-10'>
                <input id='variable{{ _uid }}' type='text' value={variable || ''} onChange={this.onChangeVariable}
                       className='form-control'/>
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='host{{ _uid }}' className='col-sm-2 control-label'>Host</label>

              <div className='col-sm-10'>
                <input id='host{{ _uid }}' type='text' value={host || ''} onChange={this.onChangeHost}
                       className='form-control'/>
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='ioPort{{ _uid }}' className='col-sm-2 control-label'>IO Port</label>

              <div className='col-sm-10'>
                <input id='ioPort{{ _uid }}' type='text' value={ioPort || ''} onChange={this.onChangeIOPort}
                       className='form-control'/>
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='proxyPort{{ _uid }}' className='col-sm-2 control-label'>Proxy Port</label>

              <div className='col-sm-10'>
                <input id='proxyPort{{ _uid }}' type='text' value={proxyPort || ''} onChange={this.onChangeProxyPort}
                       className='form-control'/>
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='mode{{ _uid }}' className='col-sm-2 control-label'>Mode</label>

              <div className='col-sm-10'>
                <Select2Component
                  value={mode || ''}
                  onChange={this.onChangeMode}
                  className='form-control'
                  id='mode{{ _uid }}'
                  options={[
                    {value: '', label: ''},
                    {value: 'manual', label: 'Manual'},
                    {value: 'background', label: 'Background'},
                  ]}
                />
              </div>
            </div>
          </div>
          {this.state.displayBrowserConnect && (
            <div className='box-footer'>
              <button type='submit' onClick={this.onBrowserConnected} className='btn btn-info pull-right'>
                Browser connected
              </button>
            </div>
          )}
        </form>
      </div>
    )
  }
}
