import React, { useImperativeHandle } from 'react'
import FlowHeader from '../flow/header.jsx'
import FormInput, { FormInputType } from '../form-input.jsx'
import { flow } from '../flow/flow.jsx'
import { ClientType } from '../../models/client-type';

/**
 * @typedef {Object} FunctionFlowData
 * @property {string} [code] - The function code
 */

const FunctionFlow = flow((props, ref) => {
  const { onPop, onUpdate, onPlay, onStop, isPlaying, data, clients } = props

  useImperativeHandle(ref, () => ({
    onSerialize: () => {
      return JSON.stringify(data?.code)
    },
    onDeserialize: (data) => {
      const code = data ? JSON.parse(data) : undefined
      return { code }
    },
    onCompile: () => {
      return data?.code || ''
    },
    onExecute: async (runner) => {
      return runner.run()
    }
  }), [data])

  const onChangeCode = (code) => {
    onUpdate({
      ...data,
      ...{code}
    })
  }

  return (
    <>
      <FlowHeader
        title="Function"
        clients={clients}
        isPlaying={isPlaying}
        onPlay={onPlay}
        onStop={onStop}
        onPop={onPop}
      />
      <form className="form-sm-horizontal">
        <FormInput
          id="code"
          type={FormInputType.EDITOR}
          label="Code"
          value={data?.code}
          onChange={onChangeCode}
          language="javascript"
          />
      </form>
    </>
  )
})

export default FunctionFlow
