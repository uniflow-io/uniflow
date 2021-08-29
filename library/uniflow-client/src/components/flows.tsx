import React from 'react';
import { FC } from 'react';
import { Search } from '.';
import { GraphProviderState } from '../contexts';

import FlowFunction from '../../../uniflow-flow-function/src'
import FlowPrompt from '../../../uniflow-flow-prompt/src'
import FlowText from '../../../uniflow-flow-text/src'

const lasyImports = {
  '@uniflow-io/uniflow-flow-function': FlowFunction,
  '@uniflow-io/uniflow-flow-prompt': FlowPrompt,
  '@uniflow-io/uniflow-flow-text': FlowText,
};

export interface Flow {
  clients: string[];
  name: string;
  tags: string[];
}

export interface FlowsProps {
  graph: GraphProviderState;
  allFlows: { [key: string]: Flow };
  programFlows: { key: string; label: string }[];
  clients: string[];
  onPush: (index: number, flowType: string) => void
  onPop: (index: number) => void
  onUpdate: (index: number, data: any) => void
  onRun: (index?: number) => void
}

const Flows: FC<FlowsProps> = (props) => {
  const { graph, onPush, onPop, onUpdate, onRun, allFlows, programFlows, clients } = props;
  return (
    <>
      <Search
        programFlows={programFlows}
        onPush={(flowType) => {
          onPush(0, flowType);
        }}
        />
      {graph.flows.map((flow, index) => {
        const TagName = lasyImports[flow.type];
        return (
          <React.Fragment key={index}>
              <TagName
                isRunning={flow.isRunning}
                data={flow.data}
                allFlows={allFlows}
                clients={clients}
                onPush={(flowType) => {
                  onPush(index, flowType);
                }}
                onPop={() => {
                  onPop(index);
                }}
                onUpdate={(data) => {
                  onUpdate(index, data);
                }}
                onRun={() => {
                  onRun(index);
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
};

export default Flows;
