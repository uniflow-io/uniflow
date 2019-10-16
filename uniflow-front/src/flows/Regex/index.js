import React, {Component} from 'react'
import {AceComponent} from '../../components'
import {onCode, onExecute, SRL} from './runner'

function copyTextToClipboard(text) {
  let textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
  } catch (err) {
  }

  document.body.removeChild(textArea)
}

export default class RegexComponent extends Component {
  state = {
    running: false,
    variable: null,
    expression: null
  }

  static tags() {
    return ['core']
  }

  static clients() {
    return ['uniflow', 'node', 'chrome', 'phpstorm']
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

  componentDidUpdate(prevProps) {
    if (this.props.bus !== prevProps.bus) {
      prevProps.bus.off('reset', this.deserialise)
      prevProps.bus.off('code', onCode.bind(this))
      prevProps.bus.off('execute', onExecute.bind(this))

      this.props.bus.on('reset', this.deserialise)
      this.props.bus.on('code', onCode.bind(this))
      this.props.bus.on('execute', onExecute.bind(this))
    }
  }

  serialise = () => {
    return [this.state.variable, this.state.expression]
  }

  deserialise = data => {
    let [variable, expression] = data || [null, null]

    this.setState({variable: variable, expression: expression})
  }

  onChangeVariable = event => {
    this.setState({variable: event.target.value}, this.onUpdate)
  }

  onChangeExpression = expression => {
    this.setState({expression: expression}, this.onUpdate)
  }

  onUpdate = () => {
    this.props.onUpdate(this.serialise())
  }

  onDelete = event => {
    event.preventDefault()

    this.props.onPop()
  }

  onCopyGenerated = event => {
    const {clipbard} = this.props

    copyTextToClipboard(clipbard)
  }

  render() {
    const {running, variable, expression} = this.state

    let generated = null

    try {
      let builder = new SRL(expression)
      generated = builder.get()
    } catch (e) {
      generated = e.message
    }

    return (
      <div className='box box-info'>
        <form className='form-horizontal'>
          <div className='box-header with-border'>
            <h3 className='box-title'>
              <button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin'/> :
                <i className='fa fa-refresh fa-cog'/>}</button>
              Regex
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
              <label htmlFor='expression{{ _uid }}' className='col-sm-2 control-label'>Expression</label>

              <div className='col-sm-10'>
                <AceComponent className='form-control' id='expression{{ _uid }}' value={expression}
                              onChange={this.onChangeExpression} placeholder='Expression' height='200'/>
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='generated{{ _uid }}' className='col-sm-2 control-label'>Generated</label>
              <div className='input-group col-sm-10' style={{'paddingLeft': '15px', 'paddingRight': '15px'}}>
                <div className='input-group-btn'>
                  <button type='button' className='btn btn-default'
                          onClick={this.onCopyGenerated}><i className='fa fa-clipboard'/>
                  </button>
                </div>
                <input type='text' className='form-control' id='generated{{ _uid }}'
                       value={generated || ''}
                       readOnly
                       placeholder='Generated'/>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
