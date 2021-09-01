import React, { useImperativeHandle, useRef, useState } from 'react'
import FlowHeader from '@uniflow-io/uniflow-client/src/components/flow/header'
import FormInput, { FormInputType } from '@uniflow-io/uniflow-client/src/components/form-input'
import { flow, FlowRunner } from '@uniflow-io/uniflow-client/src/components/flow/flow'
import { MouseEventHandler } from 'react'
import { ChangeEventHandler } from 'react'
import { useStateRef } from '@uniflow-io/uniflow-client/src/hooks/use-state-ref'
import { ClientType } from '@uniflow-io/uniflow-client/src/models/interfaces'

enum PromptChoicheType {
  STRING = 'string',
  TEXT = 'text',
  FILE = 'file',
}

export interface PromptFlowData {
  variable?: string
  messageVariable?: string,
  type?: string,
}

const PromptFlow = flow<PromptFlowData>((props, ref) => {
  const { onPop, onUpdate, onPlay, isPlaying, data, clients } = props
  const [promptInput, setPromptInput] = useState<boolean>(false)
  const [message, setMessage] = useState<string>()
  const [input, setInput, inputRef] = useStateRef<string|undefined>(undefined)
  const inputResolve = useRef<(value: unknown) => void>()

  useImperativeHandle(ref, () => ({
    onSerialize: () => {
      return [data?.variable, data?.messageVariable, data?.type].join(',')
    },
    onDeserialize: (data?: string) => {
      const [variable, messageVariable, type] = data?.split(',') || [undefined, undefined, undefined]
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
    onExecute: async (runner: FlowRunner) => {
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

  const onChangeVariable = (variable: string) => {
    onUpdate({
      ...data,
      variable
    })
  }

  const onChangeMessageVariable = (messageVariable: string) => {
    onUpdate({
      ...data,
      messageVariable
    })
  }

  const onChangeType = (type: string) => {
    onUpdate({
      ...data,
      type
    })
  }

  const onChangeInputString = (input: string) => {
    setInput(input)
  }

  const onChangeInputText = (input: string) => {
    setInput(input)
  }

  const onChangeInputFile: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.persist()
    event.preventDefault()

    let file = event.target.files![0]

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

  const onInputSave: MouseEventHandler<HTMLButtonElement> = event => {
    event.preventDefault()

    if (inputResolve.current) {
      inputResolve.current(undefined)
    }
  }
  const allChoices: {[key in PromptChoicheType]: string} = {
    [PromptChoicheType.STRING]: 'String',
    [PromptChoicheType.TEXT]: 'Text',
    [PromptChoicheType.FILE]: 'File',
  }

  let choices: {[key: string]: string} = {},
    clientKeyChoices: PromptChoicheType[] = []
  if (clients.length === 1 && clients.indexOf('uniflow') !== -1) {
    clientKeyChoices = [PromptChoicheType.STRING, PromptChoicheType.TEXT, PromptChoicheType.FILE]
  } else if (clients.length === 1 && clients.indexOf('node') !== -1) {
    clientKeyChoices = [PromptChoicheType.STRING]
  } else if (
    clients.length === 2 &&
    clients.indexOf('node') !== -1 &&
    clients.indexOf('uniflow') !== -1
  ) {
    clientKeyChoices = [PromptChoicheType.STRING]
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
          options={Object.keys(choices).map((type: string) => {
            return { value: type, label: choices[type] }
          })}
          />
        {promptInput && message && (
          <div className="row mb-3">
            <div className="offset-md-2 col-sm-10">{message}</div>
          </div>
        )}

        {promptInput && data?.type === PromptChoicheType.STRING && (
          <FormInput
            id="input-string"
            type={FormInputType.TEXT}
            label="Input"
            value={input}
            onChange={onChangeInputString}
            />
        )}

        {promptInput && data?.type === PromptChoicheType.TEXT && (
          <FormInput
            id="input-text"
            type={FormInputType.EDITOR}
            label="Input"
            value={input}
            onChange={onChangeInputText}
            />
        )}

        {promptInput && data?.type === PromptChoicheType.FILE && (
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
