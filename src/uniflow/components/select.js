import React, { Component } from 'react'
import { Select2Component } from '../../components'

export default class ComponentSelect extends Component {
    state = {
      running: false,
      variable: null,
      choices: [],
      selected: null
    }

    static tags () {
      return ['ui']
    }

    static clients () {
      return ['uniflow']
    }

    componentDidMount () {
      const { bus } = this.props

      bus.on('reset', this.deserialise)
      bus.on('compile', this.onCompile)
      bus.on('execute', this.onExecute)
    }

    componentWillUnmount () {
      const { bus } = this.props

      bus.off('reset', this.deserialise)
      bus.off('compile', this.onCompile)
      bus.off('execute', this.onExecute)
    }

    componentWillReceiveProps (nextProps) {
      const oldProps = this.props

      if (nextProps.bus !== oldProps.bus) {
        oldProps.bus.off('reset', this.deserialise)
        oldProps.bus.off('compile', this.onCompile)
        oldProps.bus.off('execute', this.onExecute)

        nextProps.bus.on('reset', this.deserialise)
        nextProps.bus.on('compile', this.onCompile)
        nextProps.bus.on('execute', this.onExecute)
      }
    }

    serialise = () => {
      return [this.state.variable, this.state.choices, this.state.selected]
    }

    deserialise = data => {
      let [variable, choices, selected] = data || [null, [], null]

      this.setState({ variable: variable, choices: choices, selected: selected })
    }

    onChangeVariable = event => {
      this.setState({ variable: event.target.value }, this.onUpdate)
    }

    onChangeSelected = selected => {
      this.setState({ selected: selected }, this.onUpdate)
    }

    onUpdate = () => {
      this.props.onUpdate(this.serialise())
    }

    onDelete = event => {
      event.preventDefault()

      this.props.onPop()
    }

    onCompile = (interpreter, scope, asyncWrapper) => {

    }

    onExecute = runner => {
      return Promise
        .resolve()
        .then(() => {
          return new Promise(resolve => {
            this.setState({ running: true }, resolve)
          })
        }).then(() => {
          if (this.state.variable && runner.hasValue(this.state.variable)) {
            this.setState({ choices: runner.getValue(this.state.variable) }, this.onUpdate)

            runner.setValue(this.state.variable, this.state.selected)
          }
        })
        .then(() => {
          return new Promise(resolve => {
            setTimeout(resolve, 500)
          })
        })
        .then(() => {
          return new Promise(resolve => {
            this.setState({ running: false }, resolve)
          })
        })
    }

    render () {
      const { running, variable, choices, selected } = this.state

      return (
        <div className='box box-info'>
          <form className='form-horizontal'>
            <div className='box-header with-border'>
              <h3 className='box-title'><button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin' /> : <i className='fa fa-refresh fa-cog' />}</button> Select</h3>
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
                <label htmlFor='select{{ _uid }}' className='col-sm-2 control-label'>Select</label>

                <div className='col-sm-10'>
                  <Select2Component
                    value={selected}
                    onChange={this.onChangeSelected}
                    className='form-control' id='select{{ _uid }}'
                    options={Object.keys(choices).map(value => {
                      return { value: value, label: choices[value] }
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
