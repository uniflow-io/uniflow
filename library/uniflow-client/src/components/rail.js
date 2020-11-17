import React, { Component, Suspense, lazy } from 'react'
import { Search } from '../components'

class UiItem extends Component {
  render() {
    const {
      tag,
      bus,
      onPush,
      onPop,
      onUpdate,
      onRun,
      flows,
      userFlows,
      clients,
    } = this.props

    let TagName = Search
    if (tag !== 'search') {
      // simple hack as webpack do not import dynamic npm modules
      const lasyImports = {
        '@uniflow-io/uniflow-flow-assets': () => import('../../../uniflow-flow-assets/src'),
        '@uniflow-io/uniflow-flow-bash': () => import('../../../uniflow-flow-bash/src'),
        '@uniflow-io/uniflow-flow-canvas': () => import('../../../uniflow-flow-canvas/src'),
        '@uniflow-io/uniflow-flow-if': () => import('../../../uniflow-flow-if/src'),
        '@uniflow-io/uniflow-flow-object': () => import('../../../uniflow-flow-object/src'),
        '@uniflow-io/uniflow-flow-javascript': () => import('../../../uniflow-flow-javascript/src'),
        '@uniflow-io/uniflow-flow-prompt': () => import('../../../uniflow-flow-prompt/src'),
        '@uniflow-io/uniflow-flow-regex': () => import('../../../uniflow-flow-regex/src'),
        '@uniflow-io/uniflow-flow-text': () => import('../../../uniflow-flow-text/src'),
        '@uniflow-io/uniflow-flow-text-list': () => import('../../../uniflow-flow-text-list/src'),
        '@uniflow-io/uniflow-flow-while': () => import('../../../uniflow-flow-while/src'),
      }
      TagName = lazy(lasyImports[tag])
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <TagName
          bus={bus}
          userFlows={userFlows}
          flows={flows}
          clients={clients}
          onPush={onPush}
          onPop={onPop}
          onUpdate={onUpdate}
          onRun={onRun}
        />
      </Suspense>
    )
  }
}

export default class Rail extends Component {
  render() {
    const {
      rail,
      onPush,
      onPop,
      onUpdate,
      onRun,
      flows,
      userFlows,
      clients,
    } = this.props
    const uiStack = (() => {
      let uiStack = [
        {
          component: 'search',
          index: 0,
        },
      ]

      for (let i = 0; i < rail.length; i++) {
        let item = rail[i]

        uiStack.push({
          component: item.flow,
          bus: item.bus,
          index: i,
        })

        uiStack.push({
          component: 'search',
          index: i + 1,
        })
      }

      return uiStack
    })()

    return uiStack.map((item, i) => (
      <UiItem
        key={i}
        tag={item.component}
        bus={item.bus}
        flows={flows}
        userFlows={userFlows}
        clients={clients}
        onPush={component => {
          onPush(item.index, component)
        }}
        onPop={() => {
          onPop(item.index)
        }}
        onUpdate={data => {
          onUpdate(item.index, data)
        }}
        onRun={event => {
          onRun(event, item.index)
        }}
      />
    ))
  }
}
