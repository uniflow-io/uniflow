import React, { Suspense, lazy } from 'react';
import { FC } from 'react';
import { Search } from '.';
import { GraphProviderState } from '../contexts';

export interface UiFlowProps {}

const UiFlow: FC<UiFlowProps> = (props) => {
  const { tag, onPush, onPop, onUpdate, onRun, allFlows, programFlows, clients } = props;

  let TagName = Search;
  if (tag !== 'search') {
    const lasyImports = {
      '@uniflow-io/uniflow-flow-function': () => import('../../../uniflow-flow-function/src'),
      '@uniflow-io/uniflow-flow-prompt': () => import('../../../uniflow-flow-prompt/src'),
      '@uniflow-io/uniflow-flow-text': () => import('../../../uniflow-flow-text/src'),
    };
    TagName = lazy(lasyImports[tag]);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TagName
        programFlows={programFlows}
        allFlows={allFlows}
        clients={clients}
        onPush={onPush}
        onPop={onPop}
        onUpdate={onUpdate}
        onRun={onRun}
      />
    </Suspense>
  );
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
}

const Flows: FC<FlowsProps> = (props) => {
  const { graph, onPush, onPop, onUpdate, onRun, allFlows, programFlows, clients } = props;
  const uiFlows = (() => {
    const uiFlows = [
      {
        component: 'search',
        index: 0,
      },
    ];

    for (let i = 0; i < graph.flows.length; i++) {
      const item = graph.flows[i];

      uiFlows.push({
        component: item.type,
        index: i,
      });

      uiFlows.push({
        component: 'search',
        index: i + 1,
      });
    }

    return uiFlows;
  })();

  return (
    <>
      {uiFlows.map((item, i) => (
        <UiFlow
          key={i}
          tag={item.component}
          allFlows={allFlows}
          programFlows={programFlows}
          clients={clients}
          onPush={(component) => {
            onPush(item.index, component);
          }}
          onPop={() => {
            onPop(item.index);
          }}
          onUpdate={(data) => {
            onUpdate(item.index, data);
          }}
          onRun={(event) => {
            onRun(event, item.index);
          }}
        />
      ))}
    </>
  );
};

export default Flows;
