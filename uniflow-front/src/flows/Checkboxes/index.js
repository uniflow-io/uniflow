import React, {Component} from 'react'
import {ICheckBoxComponent} from '../components'
import {onCode, onExecute} from './runner'

export default class CheckBoxesComponent extends Component {
  state = {
    running: false,
    variable: null,
    checkboxes: {}
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
    return [this.state.variable, this.state.checkboxes]
  }

  deserialise = data => {
    let [variable, checkboxes] = data || [null, {}]

    this.setState({variable: variable, checkboxes: checkboxes})
  }

  onChangeVariable = event => {
    this.setState({variable: event.target.value}, this.onUpdate)
  }

  onChangeCheckBox = (value, checkbox) => {
    let checkboxes = this.state.checkboxes
    checkboxes[checkbox] = value
    this.setState({checkboxes: checkboxes}, this.onUpdate)
  }

  onUpdate = () => {
    this.props.onUpdate(this.serialise())
  }

  onDelete = event => {
    event.preventDefault()

    this.props.onPop()
  }

  render() {
    const {running, variable, checkboxes} = this.state

    return (
      <div className='box box-info'>
        <form className='form-horizontal'>
          <div className='box-header with-border'>
            <h3 className='box-title'>
              <button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin'/> :
                <i className='fa fa-refresh fa-cog'/>}</button>
              Checkboxes
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
              <label htmlFor='checkboxes{{ _uid }}' className='col-sm-2 control-label'>Checkboxes</label>

              <div className='col-sm-10'>
                {Object.keys(checkboxes).map(checkbox => (
                  <div key={checkbox} className='checkbox'>
                    <label><ICheckBoxComponent value={checkboxes[checkbox]} onChange={value => {
                      this.onChangeCheckBox(value, checkbox)
                    }}/>{checkbox}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
