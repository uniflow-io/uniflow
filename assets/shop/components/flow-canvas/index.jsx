import React, { useImperativeHandle } from 'react'
import FlowHeader from '../flow/header.jsx'
import FormInput, { FormInputType } from '../form-input.jsx'
import { flow } from '../flow/flow.jsx'
import { useRef } from 'react'
import { ClientType } from '../../models/client-type';

// Canvas flow data shape:
// {
//   variable: string
//   width: number,
//   height: number,
// }

const CanvasFlow = flow((props, ref) => {
  const { onPop, onUpdate, onPlay, onStop, isPlaying, data, clients } = props
  const canvasRef = useRef(null)

  useImperativeHandle(ref, () => ({
    onSerialize: () => {
      return JSON.stringify([data?.variable, data?.width, data?.height])
    },
    onDeserialize: (data) => {
      const [variable, width, height] = data ? JSON.parse(data) : [undefined, undefined, undefined]
      return { variable, width: Number(width), height: Number(height) }
    },
    onCompile: () => {
      return ''
    },
    onExecute: async (runner) => {
      const context = runner.getContext();
      const variable = data?.variable;
      const canvasEl = canvasRef.current;

      if (!variable || !canvasEl) return;

      const renderer = context[variable];
      if (typeof renderer === 'function') {
        const g2d = canvasEl.getContext('2d');
        await renderer(g2d);
      }
    }
  }), [data])

  const onChangeVariable = (variable) => {
    onUpdate({
      ...data,
      variable
    })
  }

  const onChangeWidth = (width) => {
    onUpdate({
      ...data,
      width: Number(width)
    })
  }

  const onChangeHeight = (height) => {
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
