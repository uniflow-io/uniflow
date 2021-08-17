import React, { Suspense, lazy } from 'react';
import { Search } from '.';

export interface UiFlowProps {}

function UiFlow(props: UiFlowProps) {
  const { tag, onPush, onPop, onUpdate, onRun, allFlows, programFlows, clients } = props;

  let TagName = Search;
  if (tag !== 'search') {
    const lasyImports = {
      '@uniflow-io/uniflow-flow-code': () => import('../../../uniflow-flow-code/src'),
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
}

export interface FlowsProps {}

function Flows(props: FlowsProps) {
  const { graph, onPush, onPop, onUpdate, onRun, allFlows, programFlows, clients } = props;
  const uiFlows = (() => {
    const uiFlows = [
      {
        component: 'search',
        index: 0,
      },
    ];

    for (let i = 0; i < graph.length; i++) {
      const item = graph[i];

      uiFlows.push({
        component: item.flow,
        index: i,
      });

      uiFlows.push({
        component: 'search',
        index: i + 1,
      });
    }

    return uiFlows;
  })();

  return uiFlows.map((item, i) => (
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
  ));
}

export default Flows