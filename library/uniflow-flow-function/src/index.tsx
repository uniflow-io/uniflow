import React, { useImperativeHandle } from 'react'
import FlowHeader from '@uniflow-io/uniflow-client/src/components/flow/header'
import FormInput, { FormInputType } from '@uniflow-io/uniflow-client/src/components/form-input'
import { flow, FlowRunner } from '@uniflow-io/uniflow-client/src/components/flow/flow'

export interface FunctionFlowData {
  code?: string
}

const FunctionFlow = flow<FunctionFlowData>((props, ref) => {
  const { onPop, onUpdate, onPlay, isPlaying, data, clients } = props

  useImperativeHandle(ref, () => ({
    onSerialize: () => {
      return data?.code
    },
    onDeserialize: (data?: string) => {
      return { code: data }
    },
    onCompile: () => {
      return data?.code || ''
    },
    onExecute: async (runner: FlowRunner) => {
      return runner.run()
    }
  }), [data])

  const onChangeCode = (code: string) => {
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
