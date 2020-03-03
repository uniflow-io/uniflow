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
        '@uniflow-io/assets-flow': () => import('../../../assets-flow/src'),
        '@uniflow-io/bash-flow': () => import('../../../bash-flow/src'),
        '@uniflow-io/canvas-flow': () => import('../../../canvas-flow/src'),
        '@uniflow-io/if-flow': () => import('../../../if-flow/src'),
        '@uniflow-io/javascript-flow': () => import('../../../javascript-flow/src'),
        '@uniflow-io/object-flow': () => import('../../../object-flow/src'),
        '@uniflow-io/prompt-flow': () => import('../../../prompt-flow/src'),
        '@uniflow-io/regex-flow': () => import('../../../regex-flow/src'),
        '@uniflow-io/text-flow': () => import('../../../text-flow/src'),
        '@uniflow-io/text-list-flow': () => import('../../../text-list-flow/src'),
        '@uniflow-io/while-flow': () => import('../../../while-flow/src'),
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
