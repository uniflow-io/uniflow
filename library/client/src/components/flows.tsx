import React, { useImperativeHandle, useMemo } from 'react';
import { Search } from '.';
import { GraphProviderState } from '../contexts';
import { FlowHandle, FlowRunner } from './flow/flow';
import { forwardRef } from 'react';
import { createRef } from 'react';
import { RefObject } from 'react';

import FunctionFlow from '../../../uniflow-flow-function/src'
import PromptFlow from '../../../uniflow-flow-prompt/src'
import AssetsFlow from '../../../uniflow-flow-assets/src'
import TextFlow from '../../../uniflow-flow-text/src'
import CanvasFlow from '../../../uniflow-flow-canvas/src'
import ObjectFlow from '../../../uniflow-flow-object/src'
import { ClientType } from '../models/interfaces';

const flowImports: any = {
  '@uniflow-io/uniflow-flow-function': FunctionFlow,
  '@uniflow-io/uniflow-flow-prompt': PromptFlow,
  '@uniflow-io/uniflow-flow-text': TextFlow,
  '@uniflow-io/uniflow-flow-assets': AssetsFlow,
  '@uniflow-io/uniflow-flow-canvas': CanvasFlow,
  '@uniflow-io/uniflow-flow-object': ObjectFlow,
};

export interface FlowsHandle {
  onSerialize: (index: number) => string | undefined
  onDeserialize: (index: number, data?: string) => object
  onCompile: (index: number, client: ClientType) => string
  onExecute: (index: number, runner: FlowRunner) => Promise<void>
}

export interface FlowsProps {
  graph: GraphProviderState;
  programFlows: { key: string; label: string }[];
  clients: string[];
  onPush: (index: number, flowType: string) => void
  onPop: (index: number) => void
  onUpdate: (index: number, data: object) => void
  onPlay: (index?: number) => void
}

const Flows = forwardRef<FlowsHandle, FlowsProps>((props, ref) => {
  const { graph, onPush, onPop, onUpdate, onPlay, programFlows, clients } = props;
  const flowRefs: RefObject<FlowHandle<any>>[] = useMemo(() => 
    Array(graph.flows.length).fill(null).map(() => createRef()), 
    [graph.flows]
  );

  useImperativeHandle(ref, () => ({
    onSerialize: (index: number) => {
      return flowRefs[index].current?.onSerialize()
    },
    onDeserialize: (index: number, data?: string) => {
      return flowRefs[index].current?.onDeserialize(data)
    },
    onCompile: (index: number, client: ClientType) => {
      return flowRefs[index].current?.onCompile(client) || ''
    },
    onExecute: async (index: number, runner: FlowRunner) => {
      return flowRefs[index].current?.onExecute(runner)
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
        const Flow = flowImports[flow.type];

        return (
          <React.Fragment key={index}>
            <Flow
              ref={flowRefs[index]}
              clients={clients}
              isPlaying={flow.isPlaying}
              data={flow.data}
              onPop={() => {
                onPop(index);
              }}
              onUpdate={(data: object) => {
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
