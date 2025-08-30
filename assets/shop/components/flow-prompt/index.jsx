import React, { useImperativeHandle, useRef, useState } from 'react'
import FlowHeader from '../flow/header.jsx'
import FormInput, { FormInputType } from '../form-input.jsx'
import { flow } from '../flow/flow.jsx'
import { useStateRef } from '../../hooks/use-state-ref'
import { ClientType } from '../../models/client-type';

// Enum replacement
const PromptChoiceType = {
  STRING: 'string',
  TEXT: 'text',
  FILE: 'file',
}

/**
 * @typedef {Object} PromptFlowData
 * @property {string} [variable]
 * @property {string} [messageVariable]
 * @property {string} [type]
 */

const PromptFlow = flow((props, ref) => {
  const { onPop, onUpdate, onPlay, onStop, isPlaying, data, clients } = props
  const [promptInput, setPromptInput] = useState(false)
  const [message, setMessage] = useState()
  const [input, setInput, inputRef] = useStateRef(undefined)
  const inputResolve = useRef()

  useImperativeHandle(ref, () => ({
    onSerialize: () => {
      return JSON.stringify([data?.variable, data?.messageVariable, data?.type])
    },
    onDeserialize: (data) => {
      const [variable, messageVariable, type] = data ? JSON.parse(data) : [undefined, undefined, undefined]
      return { variable, messageVariable, type }
    },
    onCompile: (client) => {
      if (!data || !data.variable) {
        return ''
      }

      if (client === ClientType.NODE) {
        return `
        (function() {
          return new Promise(function(resolve) {
            const rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout
            });

            rl.question(${
              data.messageVariable
                ? data.messageVariable
                : JSON.stringify('prompt')
            } + ': ', function(answer) {
              ${data.variable} = answer

              rl.close()
            });

            rl.on('close', () => {
              resolve()
            })
          })
        })()
        `
      }

      return data.variable + ' = ' + JSON.stringify(inputRef.current || '')
    },
    onExecute: async (runner) => {
      let context = runner.getContext()
      if (data?.messageVariable && context[data.messageVariable]) {
        setMessage(context[data.messageVariable])
      } else {
        setMessage(undefined)
      }
      setPromptInput(true)
      setInput(undefined)
      await new Promise(resolve => {
        inputResolve.current = resolve
      })
      setPromptInput(false)
      runner.run()
    }
  }), [data])

  const onChangeVariable = (variable) => {
    onUpdate({
      ...data,
      variable
    })
  }

  const onChangeMessageVariable = (messageVariable) => {
    onUpdate({
      ...data,
      messageVariable
    })
  }

  const onChangeType = (type) => {
    onUpdate({
      ...data,
      type
    })
  }

  const onChangeInputString = (input) => {
    setInput(input)
  }

  const onChangeInputText = (input) => {
    setInput(input)
  }

  const onChangeInputFile = (event) => {
    event.persist()
    event.preventDefault()

    let file = event.target.files && event.target.files[0]
    if (!file) return

    return new Promise((resolve, error) => {
      let reader = new FileReader()
      reader.onerror = error
      reader.onload = e => {
        setInput(e.target?.result?.toString())
        resolve(undefined)
      }
      reader.readAsText(file)
    })
  }

  const onInputSave = event => {
    event.preventDefault()

    if (inputResolve.current) {
      inputResolve.current(undefined)
    }
  }

  const allChoices = {
    [PromptChoiceType.STRING]: 'String',
    [PromptChoiceType.TEXT]: 'Text',
    [PromptChoiceType.FILE]: 'File',
  }

  let choices = {},
    clientKeyChoices = []
  if (clients.length === 1 && clients.indexOf('uniflow') !== -1) {
    clientKeyChoices = [PromptChoiceType.STRING, PromptChoiceType.TEXT, PromptChoiceType.FILE]
  } else if (clients.length === 1 && clients.indexOf('node') !== -1) {
    clientKeyChoices = [PromptChoiceType.STRING]
  } else if (
    clients.length === 2 &&
    clients.indexOf('node') !== -1 &&
    clients.indexOf('uniflow') !== -1
  ) {
    clientKeyChoices = [PromptChoiceType.STRING]
  }
  choices = clientKeyChoices.reduce(function(value, key) {
    value[key] = allChoices[key]
    return value
  }, choices)

  return (
    <>
      <FlowHeader
        title="Prompt"
        clients={clients}
        isPlaying={isPlaying}
        onPlay={onPlay}
        onStop={onStop}
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
        <FormInput
          id="messageVariable"
          type={FormInputType.TEXT}
          label="Message"
          value={data?.messageVariable}
          onChange={onChangeMessageVariable}
          />
        <FormInput
          id="type"
          type={FormInputType.SELECT}
          label="Type"
          value={data?.type}
          onChange={onChangeType}
          options={Object.keys(choices).map((type) => {
            return { value: type, label: choices[type] }
          })}
          />
        {promptInput && message && (
          <div className="row mb-3">
            <div className="offset-md-2 col-sm-10">{message}</div>
          </div>
        )}

        {promptInput && data?.type === PromptChoiceType.STRING && (
          <FormInput
            id="input-string"
            type={FormInputType.TEXT}
            label="Input"
            value={input}
            onChange={onChangeInputString}
            />
        )}

        {promptInput && data?.type === PromptChoiceType.TEXT && (
          <FormInput
            id="input-text"
            type={FormInputType.EDITOR}
            label="Input"
            value={input}
            onChange={onChangeInputText}
            />
        )}

        {promptInput && data?.type === PromptChoiceType.FILE && (
          <div className="row mb-3">
            <label
              htmlFor="input-file"
              className="col-sm-2 col-form-label"
            >
              Input
            </label>

            <div className="col-sm-10">
              <input
                id="input-file"
                type="file"
                onChange={onChangeInputFile}
                className="form-control"
              />
            </div>
          </div>
        )}
      </form>
      {promptInput && (
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <button
              type="submit"
              onClick={onInputSave}
              className="btn btn-primary"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </>
  )
})

export default PromptFlow
