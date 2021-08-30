import React, { ForwardRefRenderFunction, useImperativeHandle, useMemo } from 'react';
import { Search } from '.';
import { GraphProviderState } from '../contexts';

import FlowFunction from '../../../uniflow-flow-function/src'
//import FlowPrompt from '../../../uniflow-flow-prompt/src'
//import FlowText from '../../../uniflow-flow-text/src'
import { Flow, FlowHandle } from './flow/flow';
import { forwardRef } from 'react';
import { useRef } from 'react';
import { createRef } from 'react';
import { useEffect } from 'react';

const flowImports = {
  '@uniflow-io/uniflow-flow-function': FlowFunction,
  //'@uniflow-io/uniflow-flow-prompt': FlowPrompt,
  //'@uniflow-io/uniflow-flow-text': FlowText,
};

export interface FlowsHandle {
  onSerialize: (index: number) => string | undefined
  onDeserialize: (index: number, data?: string) => any
  onCompile: (index: number) => string
  onExecute: (index: number) => void
}

export interface FlowsProps {
  graph: GraphProviderState;
  programFlows: { key: string; label: string }[];
  clients: string[];
  onPush: (index: number, flowType: string) => void
  onPop: (index: number) => void
  onUpdate: (index: number, data: any) => void
  onPlay: (index?: number) => void
}

const Flows = forwardRef<FlowsHandle, FlowsProps>((props, ref) => {
  const { graph, onPush, onPop, onUpdate, onPlay, programFlows, clients } = props;
  const flowRefs = useMemo(() => 
    Array(graph.flows.length).fill().map(() => createRef()), 
    [graph.flows]
  );

  useImperativeHandle(ref, () => ({
    onSerialize: (index: number) => {
      return flowRefs[index].current?.onSerialize()
    },
    onDeserialize: (index: number, data?: string) => {
      return flowRefs[index].current?.onDeserialize(data)
    },
    onCompile: (index: number) => {
      return flowRefs[index].current?.onCompile() || ''
    },
    onExecute: (index: number) => {
      return flowRefs[index].current?.onExecute()
    }
  }), [graph.flows])

  return (
    <>
      <Search
        programFlows={programFlows}
        onPush={(flowType) => {
          onPush(0, flowType);
        }}
        />
      {graph.flows.map((flow, index) => {
        const Flow = flowImports[flow.type] as Flow<any>;

        return (
          <React.Fragment key={index}>
            <Flow
              ref={flowRefs[index]}
              clients={clients}
              isRunning={flow.isRunning}
              data={flow.data}
              onPop={() => {
                onPop(index);
              }}
              onUpdate={(data: any) => {
                onUpdate(index, data);
              }}
              onPlay={() => {
                onPlay(index);
              }}
            />
            <Search
              programFlows={programFlows}
              onPush={(flowType) => {
                onPush(index + 1, flowType);
              }}
            />
          </React.Fragment>
        )
      })}
    </>
  );
});

export default Flows;
