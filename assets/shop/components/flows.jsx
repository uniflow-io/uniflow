import React, { useImperativeHandle, useMemo, useEffect } from 'react';
import Search from './search.jsx';
import { forwardRef } from 'react';
import { createRef } from 'react';
import { flows as flowImports } from './../models/flows'

const Flows = forwardRef((props, ref) => {
  const { graph, onPush, onPop, onUpdate, onPlay, onStop, onStopFlow, programFlows, clients } = props;
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
              onStop={() => {
                onStopFlow(index);
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
