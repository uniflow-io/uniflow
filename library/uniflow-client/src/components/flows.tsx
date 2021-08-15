import React, { Component, Suspense, lazy } from 'react';
import { Search } from '.';

class UiFlow extends Component {
  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'tag' does not exist on type 'Readonly<{}... Remove this comment to see the full error message
    const { tag, bus, onPush, onPop, onUpdate, onRun, allFlows, programFlows, clients } =
      this.props;

    let TagName = Search;
    if (tag !== 'search') {
      // simple hack as webpack do not import dynamic npm modules
      const lasyImports = {
        '@uniflow-io/uniflow-flow-code': () => import('../../../uniflow-flow-code/src'),
        '@uniflow-io/uniflow-flow-prompt': () => import('../../../uniflow-flow-prompt/src'),
        '@uniflow-io/uniflow-flow-text': () => import('../../../uniflow-flow-text/src'),
      };
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'LazyExoticComponent<ComponentType<any>>' is ... Remove this comment to see the full error message
      TagName = lazy(lasyImports[tag]);
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <TagName
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          bus={bus}
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'flows' does not exist on type 'Readonly<... Remove this comment to see the full error message
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
          // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ component: any; bus: any; inde... Remove this comment to see the full error message
          bus: item.bus,
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
        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
        tag={item.component}
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'bus' does not exist on type '{ component... Remove this comment to see the full error message
        bus={item.bus}
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
