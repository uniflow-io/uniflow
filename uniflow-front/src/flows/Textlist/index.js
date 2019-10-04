import React, {Component} from 'react'
import {onCode, onExecute} from './runner'

export default class TextListComponent extends Component {
  state = {
    running: false,
    variable: null,
    textlist: []
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
    return [this.state.variable, this.state.textlist]
  }

  deserialise = data => {
    let [variable, textlist] = data || [null, []]

    this.setState({variable: variable, textlist: textlist})
  }

  onChangeVariable = event => {
    this.setState({variable: event.target.value}, this.onUpdate)
  }

  onAddText = event => {
    event.preventDefault()

    let newStateTextlists = this.state.textlist.slice()
    newStateTextlists.push('')
    this.setState({textlist: newStateTextlists}, this.onUpdate)
  }

  onUpdateText = (event, index) => {
    this.setState({
      textlist: this.state.textlist.map((value, i) => {
        if (i !== index) {
          return value
        }

        return event.target.value
      })
    }, this.onUpdate)
  }

  onRemoveText = (event, index) => {
    let newStateTextlists = this.state.textlist.slice()
    newStateTextlists.splice(index, 1)
    this.setState({textlist: newStateTextlists}, this.onUpdate)
  }

  onUpdate = () => {
    this.props.onUpdate(this.serialise())
  }

  onDelete = event => {
    event.preventDefault()

    this.props.onPop()
  }

  render() {
    const {running, variable, textlist} = this.state

    return (
      <div className='box box-info'>
        <form className='form-horizontal'>
          <div className='box-header with-border'>
            <h3 className='box-title'>
              <button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin'/> :
                <i className='fa fa-refresh fa-cog'/>}</button>
              Text List
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

            {textlist.map((value, index) => (
              <div key={index} className='form-group'>
                <div className='col-sm-10 col-sm-offset-2'>
                  <div className='input-group'>
                    <input type='text' value={textlist[index]} onChange={event => {
                      this.onUpdateText(event, index)
                    }}
                           className='form-control'/>
                    <span className='input-group-addon' onClick={event => {
                      this.onRemoveText(event, index)
                    }}><i className='fa fa-times'/></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='box-footer'>
            <button type='submit' onClick={this.onAddText} className='btn btn-info pull-right'> Add Text</button>
          </div>
        </form>
      </div>
    )
  }
}
