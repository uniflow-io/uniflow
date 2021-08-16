import React, { Component, Suspense, lazy } from 'react';
import { Search } from '.';

class UiFlow extends Component {
  render() {
    const { tag, onPush, onPop, onUpdate, onRun, allFlows, programFlows, clients } = this.props;

    let TagName = Search;
    if (tag !== 'search') {
      // simple hack as webpack do not import dynamic npm modules
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
}

export default class Flows extends Component {
  render() {
    const { flows, onPush, onPop, onUpdate, onRun, allFlows, programFlows, clients } = this.props;
    const uiFlows = (() => {
      const uiFlows = [
        {
          component: 'search',
          index: 0,
        },
      ];

      for (let i = 0; i < flows.length; i++) {
        const item = flows[i];

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
}
