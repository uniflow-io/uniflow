import React, { useImperativeHandle, useMemo, useEffect } from 'react';
import Search from './search.jsx';
import { forwardRef } from 'react';
import { createRef } from 'react';

import FunctionFlow from './flow-function/index.jsx'
import PromptFlow from './flow-prompt/index.jsx'
import AssetsFlow from './flow-assets/index.jsx'
import TextFlow from './flow-text/index.jsx'
import CanvasFlow from './flow-canvas/index.jsx'
import ObjectFlow from './flow-object/index.jsx'

const flowImports = {
  '@uniflow-io/uniflow-flow-function': FunctionFlow,
  '@uniflow-io/uniflow-flow-prompt': PromptFlow,
  '@uniflow-io/uniflow-flow-text': TextFlow,
  '@uniflow-io/uniflow-flow-assets': AssetsFlow,
  '@uniflow-io/uniflow-flow-canvas': CanvasFlow,
  '@uniflow-io/uniflow-flow-object': ObjectFlow,
};

const Flows = forwardRef((props, ref) => {
  const { graph, onPush, onPop, onUpdate, onPlay, programFlows, clients } = props;
  const flowRefs = useMemo(() =>
    Array(graph.flows.length).fill(null).map(() => createRef()),
    [graph.flows]
  );

  useImperativeHandle(ref, () => ({
    onClients: (index) => {
        return flowRefs[index].current?.onClients()
    },
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

  useEffect(() => {
    if (props.onDeserializeReady) {
      props.onDeserializeReady();
    }
  }, [graph.flows.length]);

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
