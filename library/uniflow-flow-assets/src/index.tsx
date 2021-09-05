import React, { ChangeEvent, ChangeEventHandler, MouseEventHandler, useImperativeHandle } from 'react'
import FlowHeader from '@uniflow-io/uniflow-client/src/components/flow/header'
import FormInput, { FormInputType } from '@uniflow-io/uniflow-client/src/components/form-input'
import { flow, FlowRunner } from '@uniflow-io/uniflow-client/src/components/flow/flow'
import LZString from 'lz-string'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faTimes } from '@fortawesome/free-solid-svg-icons'

export interface AssetsFlowData {
  variable?: string
  assets?: any[]
}

const AssetsFlow = flow<AssetsFlowData>((props, ref) => {
  const { onPop, onUpdate, onPlay, isPlaying, data, clients } = props

  useImperativeHandle(ref, () => ({
    onSerialize: () => {
      return LZString.compressToEncodedURIComponent(
        JSON.stringify([data?.variable, data?.assets])
      )
    },
    onDeserialize: (data?: string) => {
      const decompressedData = data ? LZString.decompressFromEncodedURIComponent(data) : undefined
      let [variable, assets] = decompressedData
      ? JSON.parse(decompressedData)
      : [null, []]

      return { variable, assets }
    },
    onCompile: () => {
      if (!data || !data.variable) {
        return ''
      }
    
      let assets = data?.assets?.reduce(function(data, asset) {
        data[asset[0]] = asset[1]
        return data
      }, {}) || {}
    
      return data.variable + ' = ' + JSON.stringify(assets)
    },
    onExecute: async (runner: FlowRunner) => {
      if (data?.variable) {
        return runner.run()
      }
    }
  }), [data])

  const onChangeVariable = (variable: string) => {
    onUpdate({
      ...data,
      variable
    })
  }

  const onFiles: ChangeEventHandler<HTMLInputElement> = async (event) => {
    event.persist()
    event.preventDefault()

    let files = []
    if(event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        files.push(event.target.files[i])
      }
    }

    return files
      .reduce(async (promise, file) => {
        await promise
        return await new Promise((resolve, error) => {
          let reader = new FileReader()
          reader.onerror = error
          reader.onload = e => {
            let newStateAssets = data?.assets?.slice() || []
            newStateAssets.push([file.name, e.target?.result])
            onUpdate({
              ...data,
              assets: newStateAssets
            })
          }
          reader.readAsText(file)
        })
      }, Promise.resolve())
      .then(() => {
        event.target.value = ''
      })
  }

  const onDownloadFile = (event: any, index: number) => {
    let a = document.createElement('a')

    let blob = new Blob([data?.assets![index][1]], { type: 'octet/stream' })

    let url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = data?.assets![index][0]
    a.style.cssText = 'display: none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const onUpdateFile = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    onUpdate(
      {
        ...data,
        assets: data?.assets?.map((asset, i) => {
          if (i !== index) {
            return asset
          }

          return [event.target.value, asset[1]]
        }),
      }
    )
  }

  const onRemoveFile = (event: any, index: number) => {
    let newStateAssets = data?.assets?.slice() || []
    newStateAssets.splice(index, 1)
    onUpdate({ ...data, assets: newStateAssets })
  }

  return (
    <>
      <FlowHeader
        title="Assets"
        clients={clients}
        isPlaying={isPlaying}
        onPlay={onPlay}
        onPop={onPop}
      />
      <form className="form-sm-horizontal">
        <FormInput
          id="variable"
          type={FormInputType.TEXT}
          label="Variable"
          value={data?.variable}
          onChange={onChangeVariable}
          />
        {data && data.assets?.map((asset, index) => (
          <div key={index} className="row">
            <div className="col-sm-10 offset-sm-2">
              <div className="input-group">
                <button
                  type="button"
                  className="input-group-text"
                  onClick={event => {
                    onDownloadFile(event, index)
                  }}
                >
                  <FontAwesomeIcon icon={faDownload} />
                </button>
                <input
                  type="text"
                  value={asset[0]}
                  onChange={event => {
                    onUpdateFile(event, index)
                  }}
                  className="form-control"
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={event => {
                    onRemoveFile(event, index)
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
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
                onChange={onFiles}
                className="custom-file-input"
              />
              <label className="custom-file-label" htmlFor="assets{{ _uid }}">
                Choose file
              </label>
            </div>
          </div>
        </div>
      </form>
    </>
  )
})

export default AssetsFlow
