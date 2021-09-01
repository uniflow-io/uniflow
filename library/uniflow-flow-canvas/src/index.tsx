import React, { useImperativeHandle } from 'react'
import { FlowHeader } from '@uniflow-io/uniflow-client/src/components'
import FormInput, { FormInputType } from '@uniflow-io/uniflow-client/src/components/form-input'
import { flow } from '@uniflow-io/uniflow-client/src/components/flow/flow'
import { useRef } from 'react'
import { FlowRunner } from '@uniflow-io/uniflow-client/src/models/runner'

export interface CanvasFlowData {
  variable?: string
  width?: number,
  height?: number,
}

const CanvasFlow = flow<CanvasFlowData>((props, ref) => {
  const { onPop, onUpdate, onPlay, isPlaying, data, clients } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useImperativeHandle(ref, () => ({
    onSerialize: () => {
      return [data?.variable, data?.width, data?.height].join(',')
    },
    onDeserialize: (data?: string) => {
      const [variable, width, height] = data?.split(',') || [undefined, undefined, undefined]
      return { variable, width: Number(width), height: Number(height) }
    },
    onCompile: () => {
      return ''
    },
    onExecute: async (runner: FlowRunner) => {
      let context = runner.getContext()
      if (data?.variable && canvasRef.current) {
        context[data?.variable] = canvasRef.current
      }
    }
  }), [data])

  const onChangeVariable = (variable: string) => {
    onUpdate({
      ...data,
      variable
    })
  }


  const onChangeWidth = (width: string) => {
    onUpdate({
      ...data,
      width: Number(width)
    })
  }


  const onChangeHeight = (height: string) => {
    onUpdate({
      ...data,
      height: Number(height)
    })
  }

  return (
    <>
      <FlowHeader
        title="Canvas"
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
          id="width"
          type={FormInputType.TEXT}
          label="Width"
          value={data?.width}
          onChange={onChangeWidth}
          />
        <FormInput
          id="height"
          type={FormInputType.TEXT}
          label="Height"
          value={data?.height}
          onChange={onChangeHeight}
          />
        <div className="row mb-3">
          <label
            htmlFor="canvas{{ _uid }}"
            className="col-sm-2 col-form-label"
          >
            Canvas
          </label>

          <div className="col-sm-10">
            <canvas
              ref={canvasRef}
              id="canvas{{ _uid }}"
              width={data?.width}
              height={data?.height}
            />
          </div>
        </div>
      </form>
    </>
  )
})

export default CanvasFlow
