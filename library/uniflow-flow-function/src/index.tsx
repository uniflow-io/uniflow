import React, { FC } from 'react'
import { FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import Container from '@uniflow-io/uniflow-client/src/container'
import Flow from '@uniflow-io/uniflow-client/src/services/flow'
import FormInput, { FormInputType } from '../../uniflow-client/src/components/form-input'

const container = new Container()
const flow = container.get(Flow)

export interface FunctionFlowProps {
  isRunning: boolean
  data: {
    code?: string
  }
  clients: string[];
  onPop: () => void
  onUpdate: (data: any) => void
  onRun: () => void
}

const FunctionFlow: FC<FunctionFlowProps> = (props) => {
  const { clients, onPop, onUpdate, onRun, isRunning, data } = props

  const serialize = () => {
    return data.code
  }

  const deserialize = (data: string) => {
    return { code: data }
  }

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
        isRunning={isRunning}
        onRun={onRun}
        onPop={onPop}
      />
      <form className="form-sm-horizontal">
        <FormInput
          id="code"
          type={FormInputType.EDITOR}
          label="Code"
          value={data.code}
          onChange={onChangeCode}
          language="javascript"
          />
      </form>
    </>
  )
}

export default FunctionFlow
