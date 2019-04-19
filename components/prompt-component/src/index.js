import React, { Component } from 'react'
import { AceComponent } from 'uniflow/src/components'
import { Select2Component } from 'uniflow/src/components'

export default class PromptComponent extends Component {
    state = {
      running: false,
      variable: null,
      messageVariable: null,
      type: null,
      promptDisplay: false,
      message: null,
      input: null
    }

    static tags () {
      return ['core']
    }

    static clients () {
      return ['uniflow', 'bash']
    }

    constructor (props) {
      super(props)

      this.inputResolve = null
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
      return [this.state.variable, this.state.messageVariable, this.state.type]
    }

    deserialise = data => {
      let [variable, messageVariable, type] = data || [null, null, null]

      this.setState({ variable: variable, messageVariable: messageVariable, type: type })
    }

    onChangeVariable = event => {
      this.setState({ variable: event.target.value }, this.onUpdate)
    }

    onChangeMessageVariable = event => {
      this.setState({ messageVariable: event.target.value }, this.onUpdate)
    }

    onChangeType = type => {
      this.setState({ type: type }, this.onUpdate)
    }

    onChangeInputString = event => {
      this.setState({ input: event.target.value })
    }

    onChangeInputText = value => {
      this.setState({ input: value })
    }

    onChangeInputFile = event => {
      event.persist()
      event.preventDefault()

      let file = event.target.files[0]

      return new Promise((resolve, error) => {
        let reader = new FileReader()
        reader.onerror = error
        reader.onload = e => {
          this.setState({ input: e.target.result }, resolve)
        }
        reader.readAsText(file)
      })
    }

    onUpdate = () => {
      this.props.onUpdate(this.serialise())
    }

    onInputSave = event => {
      event.preventDefault()

      if (this.inputResolve) {
        this.inputResolve()
      }
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
          return new Promise(resolve => {
            if (this.state.messageVariable && runner.hasValue(this.state.messageVariable)) {
              this.setState({ message: runner.getValue(this.state.messageVariable) }, resolve)
            } else {
              this.setState({ message: null }, resolve)
            }
          })
            .then(() => {
              return new Promise(resolve => {
                this.setState({ promptDisplay: true, input: null }, resolve)
              })
            })
            .then(() => {
              return new Promise(resolve => {
                this.inputResolve = resolve
              })
            })
            .then(() => {
              if (this.state.variable) {
                runner.setValue(this.state.variable, this.state.input)
              }
            })
            .then(() => {
              return new Promise(resolve => {
                this.setState({ promptDisplay: false }, resolve)
              })
            })
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
      const { running, variable, messageVariable, type, promptDisplay, message, input } = this.state

      const choices = {
        'string': 'String',
        'text': 'Text',
        'file': 'File'
      }

      return (
        <div className='box box-info'>
          <form className='form-horizontal'>
            <div className='box-header with-border'>
              <h3 className='box-title'><button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin' /> : <i className='fa fa-refresh fa-cog' />}</button> Prompt</h3>
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
                <label htmlFor='variable{{ _uid }}' className='col-sm-2 control-label'>Message Variable</label>

                <div className='col-sm-10'>
                  <input id='variable{{ _uid }}' type='text' value={messageVariable || ''} onChange={this.onChangeMessageVariable} className='form-control' />
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
                    options={Object.keys(choices).map(value => {
                      return { value: value, label: choices[value] }
                    })}
                  />
                </div>
              </div>

              {promptDisplay && message && (
                <div className='form-group'>
                  <div className='col-md-offset-2 col-sm-10'>{message}</div>
                </div>
              )}

              {promptDisplay && type === 'string' && (
                <div className='form-group'>
                  <label htmlFor='input_string{{ _uid }}' className='col-sm-2 control-label'>Input</label>

                  <div className='col-sm-10'>
                    <input id='input_string{{ _uid }}' type='text' value={input || ''} onChange={this.onChangeInputString} className='form-control' />
                  </div>
                </div>
              )}

              {promptDisplay && type === 'text' && (
                <div className='form-group'>
                  <label htmlFor='input_text{{ _uid }}' className='col-sm-2 control-label'>Input</label>

                  <div className='col-sm-10'>
                    <AceComponent className='form-control' id='input_text{{ _uid }}' value={input || ''} onChange={this.onChangeInputText} placeholder='Text' height='200' />
                  </div>
                </div>
              )}

              {promptDisplay && type === 'file' && (
                <div className='form-group'>
                  <label htmlFor='input_file{{ _uid }}' className='col-sm-2 control-label'>Input</label>

                  <div className='col-sm-10'>
                    <input id='input_file{{ _uid }}' type='file' onChange={this.onChangeInputFile} className='form-control' />
                  </div>
                </div>
              )}

            </div>

            {promptDisplay && (
              <div className='box-footer'>
                <button type='submit' onClick={this.onInputSave} className='btn btn-info pull-right'>
                            Save
                </button>
              </div>
            )}
          </form>
        </div>
      )
    }
}
