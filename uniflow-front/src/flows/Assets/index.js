import React, {Component} from 'react'
import LZString from 'lz-string'
import {onCode, onExecute} from './runner'

export default class AssetsComponent extends Component {
  state = {
    running: false,
    variable: null,
    assets: []
  }

  static tags() {
    return ['core']
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
    return LZString.compressToEncodedURIComponent(JSON.stringify([this.state.variable, this.state.assets]))
  }

  deserialise = data => {
    let [variable, assets] = data ? JSON.parse(LZString.decompressFromEncodedURIComponent(data)) : [null, []]

    this.setState({variable: variable, assets: assets})
  }

  onChangeVariable = event => {
    this.setState({variable: event.target.value}, this.onUpdate)
  }

  onFiles = event => {
    event.persist()
    event.preventDefault()

    let files = []
    for (let i = 0; i < event.target.files.length; i++) {
      files.push(event.target.files[i])
    }

    return files.reduce((promise, file) => {
      return promise.then(() => {
        return new Promise((resolve, error) => {
          let reader = new FileReader()
          reader.onerror = error
          reader.onload = e => {
            let newStateAssets = this.state.assets.slice()
            newStateAssets.push([file.name, e.target.result])
            this.setState({assets: newStateAssets}, resolve)
          }
          reader.readAsText(file)
        })
      })
    }, Promise.resolve()).then(() => {
      event.target.value = ''

      this.onUpdate()
    })
  }

  onDownloadFile = (event, index) => {
    let a = document.createElement('a')

    let blob = new Blob([this.state.assets[index][1]], {type: 'octet/stream'})

    let url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = this.state.assets[index][0]
    a.style = 'display: none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  onUpdateFile = (event, index) => {
    this.setState({
      assets: this.state.assets.map((asset, i) => {
        if (i !== index) {
          return asset
        }

        return [event.target.value, asset[1]]
      })
    }, this.onUpdate)
  }

  onRemoveFile = (event, index) => {
    let newStateAssets = this.state.assets.slice()
    newStateAssets.splice(index, 1)
    this.setState({assets: newStateAssets}, this.onUpdate)
  }

  onUpdate = () => {
    this.props.onUpdate(this.serialise())
  }

  onDelete = event => {
    event.preventDefault()

    this.props.onPop()
  }

  render() {
    const {running, variable, assets} = this.state

    return (
      <div className='box box-info'>
        <form className='form-horizontal'>
          <div className='box-header with-border'>
            <h3 className='box-title'>
              <button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin'/> :
                <i className='fa fa-refresh fa-cog'/>}</button>
              Assets
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

            {assets.map((asset, index) => (
              <div key={index} className='form-group'>
                <div className='col-sm-10 col-sm-offset-2'>
                  <div className='input-group'>
                    <span className='input-group-addon' onClick={event => {
                      this.onDownloadFile(event, index)
                    }}><i className='fa fa-download'/></span>
                    <input type='text' value={asset[0]} onChange={event => {
                      this.onUpdateFile(event, index)
                    }} className='form-control'/>
                    <span className='input-group-addon' onClick={event => {
                      this.onRemoveFile(event, index)
                    }}><i className='fa fa-times'/></span>
                  </div>
                </div>
              </div>
            ))}

            <div className='form-group'>
              <label htmlFor='assets{{ _uid }}' className='col-sm-2 control-label'>Assets</label>

              <div className='col-sm-10'>
                <input id='assets{{ _uid }}' type='file' multiple onChange={this.onFiles} className='form-control'/>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
