import React, {Component} from 'react'
import {AceComponent} from 'uniflow/src/components'
import {onCode} from './runner'

export default class BashComponent extends Component {
  state = {
    running: false,
    bash: null
  }

  static tags() {
    return ['core']
  }

  static clients() {
    return ['node']
  }

  componentDidMount() {
    const {bus} = this.props
    bus.on('reset', this.deserialise)
    bus.on('code', onCode.bind(this))
  }

  componentWillUnmount() {
    const {bus} = this.props
    bus.off('reset', this.deserialise)
    bus.off('code', onCode.bind(this))
  }

  componentWillReceiveProps(nextProps) {
    const oldProps = this.props

    if (nextProps.bus !== oldProps.bus) {
      oldProps.bus.off('reset', this.deserialise)
      oldProps.bus.off('code', onCode.bind(this))

      nextProps.bus.on('reset', this.deserialise)
      nextProps.bus.on('code', onCode.bind(this))
    }
  }

  serialise = () => {
    return this.state.bash
  }

  deserialise = data => {
    this.setState({bash: data})
  }

  onChangeBash = bash => {
    this.setState({bash: bash}, this.onUpdate)
  }

  onUpdate = () => {
    this.props.onUpdate(this.serialise())
  }

  onDelete = event => {
    event.preventDefault()

    this.props.onPop()
  }

  render() {
    const {running, bash} = this.state

    return (
      <div className='box box-info'>
        <form className='form-horizontal'>
          <div className='box-header with-border'>
            <h3 className='box-title'>
              <button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin'/> :
                <i className='fa fa-refresh fa-cog'/>}</button>
              Bash
            </h3>
            <div className='box-tools pull-right'>
              <button className='btn btn-box-tool' onClick={this.onDelete}><i className='fa fa-times'/></button>
            </div>
          </div>
          <div className='box-body'>
            <div className='form-group'>
              <label htmlFor='bash{{ _uid }}' className='col-sm-2 control-label'>Bash</label>

              <div className='col-sm-10'>
                <AceComponent className='form-control' id='bash{{ _uid }}' value={bash} onChange={this.onChangeBash}
                              placeholder='Bash' height='200' mode='batchfile'/>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
