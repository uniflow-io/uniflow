import React, { useImperativeHandle } from 'react'
import FlowHeader from '../flow/header.jsx'
import FormInput, { FormInputType } from '../form-input.jsx'
import { flow } from '../flow/flow.jsx'
import { ClientType } from '../../models/client-type';

const TextFlow = flow((props, ref) => {
  const { onPop, onUpdate, onPlay, onStop, isPlaying, data, clients } = props

  useImperativeHandle(ref, () => ({
    onSerialize: () => {
      return JSON.stringify([data?.variable, data?.text])
    },
    onDeserialize: (data) => {
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
    onExecute: async (runner) => {
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

  const onChangeVariable = (variable) => {
    onUpdate({
      ...data,
      variable
    })
  }

  const onChangeText = (text) => {
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
