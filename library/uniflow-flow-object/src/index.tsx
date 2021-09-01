import React, { ChangeEvent, useImperativeHandle } from 'react'
import { FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import FormInput, { FormInputType } from '@uniflow-io/uniflow-client/src/components/form-input'
import { flow } from '@uniflow-io/uniflow-client/src/components/flow/flow'
import PropertyAccessor from 'property-accessor'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FlowRunner } from '@uniflow-io/uniflow-client/src/models/runner'

export interface ObjectFlowData {
  variable?: string
  keyValueList?: {key: string, value: string|number}[]
}

const ObjectFlow = flow<ObjectFlowData>((props, ref) => {
  const { onPop, onUpdate, onPlay, isPlaying, data, clients } = props

  useImperativeHandle(ref, () => ({
    onSerialize: () => {
      let object = JSON.stringify(transform())
      return [data?.variable, object].join(',')
    },
    onDeserialize: (data?: string) => {
      let [variable, object] = data?.split(',') || [undefined, undefined]
      let keyValueList = reverseTransform(JSON.parse(object || '[]'))
  
      return { variable, keyValueList }
    },
    onCompile: () => {
      if (!data || !data.variable) {
        return ''
      }
    
      let object = transform()
      return data.variable + ' = ' + JSON.stringify(object)
    },
    onExecute: async (runner: FlowRunner) => {
      if (data?.variable) {
        let context = runner.getContext()
        if (context[data.variable]) {
          let object = context[data.variable]
          let keyValueList = reverseTransform(object)
          onUpdate({ ...data, keyValueList })
        } else {
          return runner.run()
        }
      }
    }
  }), [data])
  
  const transform = (): {[key: string]: string|number} => {
    return data?.keyValueList?.reduce(function(object, item) {
      if (item.key) {
        let value: string|number = item.value
        if (typeof value === 'string' && /^[0-9]+$/.test(value)) {
          value = Number.parseInt(value)
        }

        try {
          let accessor = new PropertyAccessor(object)
          accessor.set(item.key, value)
        } catch (e) {}
      }
      return object
    }, {}) || {}
  }

  const reverseTransform = (object: {[key: string]: string|number}): {key: string, value: string|number}[] => {
    let flatten = function(data: any, accessors = []) {
      return Object.entries(data).reduce(function(list: {key: string, value: string|number}[], item: any) {
        if (typeof item[1] === 'object') {
          list = list.concat(flatten(item[1], accessors.concat([item[0] as never])))
        } else {
          let key = item[0]
          for (let i = accessors.length - 1; i >= 0; i--) {
            if (key[0] !== '[') {
              key = '.' + key
            }

            if (/^[0-9]+$/.test(accessors[i])) {
              key = '[' + accessors[i] + ']' + key
            } else {
              key = accessors[i] + key
            }
          }
          list.push({ key: key, value: item[1] })
        }
        return list
      }, [])
    }

    return flatten(object)
  }

  const onChangeVariable = (variable: string) => {
    onUpdate({
      ...data,
      variable
    })
  }

  const onUpdateItemKey = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    onUpdate(
      {
        ...data,
        keyValueList: data?.keyValueList?.map((item, i) => {
          if (i !== index) {
            return item
          }

          return {
            ...item,
            ...{ key: event.target.value },
          }
        }),
      },
    )
  }

  const onUpdateItemValue = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    onUpdate(
      {
        ...data,
        keyValueList: data?.keyValueList?.map((item, i) => {
          if (i !== index) {
            return item
          }

          return {
            ...item,
            ...{ value: event.target.value },
          }
        }),
      },
    )
  }

  const onRemoveItem = (event: any, index: number) => {
    event.preventDefault()

    let keyValueList = data?.keyValueList?.slice() || []
    keyValueList.splice(index, 1)
    onUpdate({ ...data, keyValueList })
  }

  const onAddItem = (event: any) => {
    event.preventDefault()

    let keyValueList = data?.keyValueList?.slice() || []
    keyValueList.push({ key: '', value: '' })
    onUpdate({ ...data, keyValueList })
  }

  return (
    <>
      <FlowHeader
        title="Object"
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
        {data?.keyValueList?.map((item, index) => (
          <div className="row" key={index}>
            <div className="col-sm-4 offset-sm-2">
              <input
                type="text"
                value={item.key}
                onChange={event => onUpdateItemKey(event, index)}
                className="form-control"
                placeholder="key"
              />
            </div>
            <div className="col-sm-6">
              <div className="input-group">
                <input
                  type="text"
                  value={item.value}
                  onChange={event => onUpdateItemValue(event, index)}
                  className="form-control"
                  placeholder="value"
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={event => {
                    onRemoveItem(event, index)
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </form>
      <div className="row mb-3">
        <div className="col-auto ml-auto">
          <button
            type="submit"
            onClick={onAddItem}
            className="btn btn-info"
          >
            Add Item
          </button>
        </div>
      </div>
    </>
  )
})

export default ObjectFlow
