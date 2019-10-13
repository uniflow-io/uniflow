import React, {Component} from 'react'
import {Select2Component} from '../components'
import {onCode, onExecute} from './runner'

export default class SelectComponent extends Component {
  state = {
    running: false,
    variable: null,
    choices: [],
    selected: null
  }

  static tags() {
    return ['ui']
  }

  static clients() {
    return ['uniflow']
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
    return [this.state.variable, this.state.choices, this.state.selected]
  }

  deserialise = data => {
    let [variable, choices, selected] = data || [null, [], null]

    this.setState({variable: variable, choices: choices, selected: selected})
  }

  onChangeVariable = event => {
    this.setState({variable: event.target.value}, this.onUpdate)
  }

  onChangeSelected = selected => {
    this.setState({selected: selected}, this.onUpdate)
  }

  onUpdate = () => {
    this.props.onUpdate(this.serialise())
  }

  onDelete = event => {
    event.preventDefault()

    this.props.onPop()
  }

  render() {
    const {running, variable, choices, selected} = this.state

    return (
      <div className='box box-info'>
        <form className='form-horizontal'>
          <div className='box-header with-border'>
            <h3 className='box-title'>
              <button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin'/> :
                <i className='fa fa-refresh fa-cog'/>}</button>
              Select
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
              <label htmlFor='select{{ _uid }}' className='col-sm-2 control-label'>Select</label>

              <div className='col-sm-10'>
                <Select2Component
                  value={selected}
                  onChange={this.onChangeSelected}
                  className='form-control' id='select{{ _uid }}'
                  options={Object.keys(choices).map(value => {
                    return {value: value, label: choices[value]}
                  })}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
