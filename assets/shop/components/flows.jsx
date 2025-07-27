import React, { useImperativeHandle, useMemo } from 'react';
import Search from './search.jsx';
import { forwardRef } from 'react';
import { createRef } from 'react';

import FunctionFlow from './flow-function/index.jsx'
//import PromptFlow from './flow-prompt/index.jsx'
//import AssetsFlow from './flow-assets/index.jsx'
//import TextFlow from './flow-text/index.jsx'
//import CanvasFlow from './flow-canvas/index.jsx'
//import ObjectFlow from './flow-object/index.jsx'

const flowImports = {
  '@uniflow-io/uniflow-flow-function': FunctionFlow,
  //'@uniflow-io/uniflow-flow-prompt': PromptFlow,
  //'@uniflow-io/uniflow-flow-text': TextFlow,
  //'@uniflow-io/uniflow-flow-assets': AssetsFlow,
  //'@uniflow-io/uniflow-flow-canvas': CanvasFlow,
  //'@uniflow-io/uniflow-flow-object': ObjectFlow,
};

// FlowsHandle defines the methods that can be called on the Flows component
// onSerialize: (index) => string | undefined
// onDeserialize: (index, data) => object
// onCompile: (index, client) => string
// onExecute: (index, runner) => Promise<void>

// FlowsProps defines the props for the Flows component
// graph: GraphProviderState
// programFlows: Array of { key: string, label: string }
// clients: Array of strings
// onPush: (index, flowType) => void
// onPop: (index) => void
// onUpdate: (index, data) => void
// onPlay: (index?) => void

const Flows = forwardRef((props, ref) => {
  const { graph, onPush, onPop, onUpdate, onPlay, programFlows, clients } = props;
  const flowRefs = useMemo(() =>
    Array(graph.flows.length).fill(null).map(() => createRef()),
    [graph.flows]
  );

  useImperativeHandle(ref, () => ({
    onSerialize: (index) => {
      return flowRefs[index].current?.onSerialize()
    },
    onDeserialize: (index, data) => {
      return flowRefs[index].current?.onDeserialize(data)
    },
    onCompile: (index, client) => {
      return flowRefs[index].current?.onCompile(client) || ''
    },
    onExecute: async (index, runner) => {
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
              onUpdate={(data) => {
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
