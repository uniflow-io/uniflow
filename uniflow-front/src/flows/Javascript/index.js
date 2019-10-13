import React, { Component } from 'react'
import {onCode, onExecute} from './runner'
import {withFlow, AceComponent} from '../../components'

class JavascriptComponent extends Component {
  state = {
    running: false,
    javascript: null
  }

  static tags() {
    return ['core']
  }

  static clients() {
    return ['uniflow', 'phpstorm', 'chrome', 'node']
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
    return this.state.javascript
  }

  deserialise = data => {
    this.setState({javascript: data})
  }

  onChangeJavascript = javascript => {
    this.setState({javascript: javascript}, this.onUpdate)
  }

  onUpdate = () => {
    this.props.onUpdate(this.serialise())
  }

  onDelete = event => {
    event.preventDefault()

    this.props.onPop()
  }

  render() {
    const {running, javascript} = this.state

    return (
      <div className='box box-info'>
        <form className='form-horizontal'>
          <div className='box-header with-border'>
            <h3 className='box-title'>
              <button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin'/> :
                <i className='fa fa-refresh fa-cog'/>}</button>
              Javascript
            </h3>
            <div className='box-tools pull-right'>
              <button className='btn btn-box-tool' onClick={this.onDelete}><i className='fa fa-times'/></button>
            </div>
          </div>
          <div className='box-body'>
            <div className='form-group'>
              <label htmlFor='javascript{{ _uid }}' className='col-sm-2 control-label'>Javascript</label>

              <div className='col-sm-10'>
                <AceComponent className='form-control' id='javascript{{ _uid }}' value={javascript}
                              onChange={this.onChangeJavascript} placeholder='Javascript' height='200'
                              mode='javascript'/>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default withFlow(JavascriptComponent)
