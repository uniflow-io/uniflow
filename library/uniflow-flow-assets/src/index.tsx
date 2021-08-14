import React, { Component } from 'react'
import LZString from 'lz-string'
import { onCode, onExecute } from './runner'
import { FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faTimes } from '@fortawesome/free-solid-svg-icons'
import {
  setBusEvents,
  componentDidMount,
  componentWillUnmount,
  componentDidUpdate,
  onExecuteHelper,
  onUpdate,
  onDelete,
} from '@uniflow-io/uniflow-client/src/utils/flow'

class AssetsFlow extends Component {
  state = {
    isRunning: false,
    variable: null,
    assets: [],
  }

  constructor(props) {
    super(props)

    setBusEvents(
      {
        deserialize: this.deserialize,
        code: onCode.bind(this),
        execute: onExecuteHelper(onExecute.bind(this), this),
      },
      this
    )
  }

  componentDidMount() {
    componentDidMount(this)
  }

  componentWillUnmount() {
    componentWillUnmount(this)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(prevProps, this)
  }

  serialize = () => {
    return LZString.compressToEncodedURIComponent(
      JSON.stringify([this.state.variable, this.state.assets])
    )
  }

  deserialize = data => {
    let [variable, assets] = data
      ? JSON.parse(LZString.decompressFromEncodedURIComponent(data))
      : [null, []]

    this.setState({ variable: variable, assets: assets })
  }

  onChangeVariable = event => {
    this.setState({ variable: event.target.value }, onUpdate(this))
  }

  onFiles = event => {
    event.persist()
    event.preventDefault()

    let files = []
    for (let i = 0; i < event.target.files.length; i++) {
      files.push(event.target.files[i])
    }

    return files
      .reduce((promise, file) => {
        return promise.then(() => {
          return new Promise((resolve, error) => {
            let reader = new FileReader()
            reader.onerror = error
            reader.onload = e => {
              let newStateAssets = this.state.assets.slice()
              newStateAssets.push([file.name, e.target.result])
              this.setState({ assets: newStateAssets }, resolve)
            }
            reader.readAsText(file)
          })
        })
      }, Promise.resolve())
      .then(() => {
        event.target.value = ''
      })
      .then(onUpdate(this))
  }

  onDownloadFile = (event, index) => {
    let a = document.createElement('a')

    let blob = new Blob([this.state.assets[index][1]], { type: 'octet/stream' })

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
    this.setState(
      {
        assets: this.state.assets.map((asset, i) => {
          if (i !== index) {
            return asset
          }

          return [event.target.value, asset[1]]
        }),
      },
      onUpdate(this)
    )
  }

  onRemoveFile = (event, index) => {
    let newStateAssets = this.state.assets.slice()
    newStateAssets.splice(index, 1)
    this.setState({ assets: newStateAssets }, onUpdate(this))
  }

  render() {
    const { clients, onRun } = this.props
    const { isRunning, variable, assets } = this.state

    return (
      <>
        <FlowHeader
          title="Assets"
          clients={clients}
          isRunning={isRunning}
          onRun={onRun}
          onDelete={onDelete(this)}
        />
        <form className="form-sm-horizontal">
          <div className="row mb-3">
            <label
              htmlFor="variable{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Variable
            </label>

            <div className="col-sm-10">
              <input
                id="variable{{ _uid }}"
                type="text"
                value={variable || ''}
                onChange={this.onChangeVariable}
                className="form-control"
              />
            </div>
          </div>

          {assets.map((asset, index) => (
            <div key={index} className="row">
              <div className="col-sm-10 offset-sm-2">
                <div className="input-group">
                  <button
                    type="button"
                    className="input-group-text"
                    onClick={event => {
                      this.onDownloadFile(event, index)
                    }}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <input
                    type="text"
                    value={asset[0]}
                    onChange={event => {
                      this.onUpdateFile(event, index)
                    }}
                    className="form-control"
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="input-group-text"
                      onClick={event => {
                        this.onRemoveFile(event, index)
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="row mb-3">
            <label
              htmlFor="assets{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Assets
            </label>

            <div className="col-sm-10">
              <div className="custom-file">
                <input
                  id="assets{{ _uid }}"
                  type="file"
                  multiple
                  onChange={this.onFiles}
                  className="custom-file-input"
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  Choose file
                </label>
              </div>
            </div>
          </div>
        </form>
      </>
    )
  }
}

export default AssetsFlow
