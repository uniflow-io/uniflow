import React, { useImperativeHandle } from 'react'
import FlowHeader from '@uniflow-io/uniflow-client/src/components/flow/header'
import FormInput, { FormInputType } from '@uniflow-io/uniflow-client/src/components/form-input'
import { flow, FlowRunner } from '@uniflow-io/uniflow-client/src/components/flow/flow'

export interface TextFlowData {
  variable?: string
  text?: string
}

const TextFlow = flow<TextFlowData>((props, ref) => {
  const { onPop, onUpdate, onPlay, isPlaying, data, clients } = props

  useImperativeHandle(ref, () => ({
    onSerialize: () => {
      return JSON.stringify([data?.variable, data?.text])
    },
    onDeserialize: (data?: string) => {
      const [variable, text] = data ? JSON.parse(data) : [undefined, undefined]
      return { variable, text }
    },
    onCompile: () => {
      if (!data || !data.variable) {
        return ''
      }
    
      let text = data.text || ''
      text = JSON.stringify(text)
    
      return data.variable + ' = ' + text
    },
    onExecute: async (runner: FlowRunner) => {
      if (data && data.variable) {
        let context = runner.getContext()
        if (context[data.variable]) {
          onUpdate({
            ...data,
            text: context[data.variable]
          })
        } else {
          return runner.run()
        }
      }
    }
  }), [data])

  const onChangeVariable = (variable: string) => {
    onUpdate({
      ...data,
      variable
    })
  }

  const onChangeText = (text: string) => {
    onUpdate({
      ...data,
      text
    })
  }

  return (
    <>
      <FlowHeader
        title="Text"
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
          id="text"
          type={FormInputType.EDITOR}
          label="Text"
          value={data?.text}
          onChange={onChangeText}
          />
      </form>
    </>
  )
})

export default TextFlow

