import React, { Component } from 'react'

export default class ComponentTextList extends Component {
    state = {
      running: false,
      variable: null,
      textlist: []
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
      return [this.state.variable, this.state.textlist]
    }

    deserialise = data => {
      let [variable, textlist] = data || [null, []]

      this.setState({ variable: variable, textlist: textlist })
    }

    onChangeVariable = event => {
      this.setState({ variable: event.target.value }, this.onUpdate)
    }

    onAddText = event => {
      event.preventDefault()

      let newStateTextlists = this.state.textlist.slice()
      newStateTextlists.push('')
      this.setState({ textlist: newStateTextlists }, this.onUpdate)
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
      this.setState({ textlist: newStateTextlists }, this.onUpdate)
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
          if (this.state.variable) {
            if (runner.hasValue(this.state.variable)) {
              this.setState({ textlist: runner.getValue(this.state.variable) }, this.onUpdate)
            } else {
              runner.setValue(this.state.variable, this.state.textlist)
            }
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
      const { running, variable, textlist } = this.state

      return (
        <div className='box box-info'>
          <form className='form-horizontal'>
            <div className='box-header with-border'>
              <h3 className='box-title'><button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin' /> : <i className='fa fa-refresh fa-cog' />}</button> Text List</h3>
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

              {textlist.map((value, index) => (
                <div key={index} className='form-group'>
                  <div className='col-sm-10 col-sm-offset-2'>
                    <div className='input-group'>
                      <input type='text' value={textlist[index]} onChange={event => {
                        this.onUpdateText(event, index)
                      }}
                      className='form-control' />
                      <span className='input-group-addon' onClick={event => {
                        this.onRemoveText(event, index)
                      }}><i className='fa fa-times' /></span>
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
