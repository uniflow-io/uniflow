import React, { Component } from 'react'
import { SearchComponent } from '../../components'

class UiComponent extends Component {
    render () {
      const { tag, bus, onPush, onPop, onUpdate, flows, userFlows } = this.props

        let TagName = SearchComponent
        if(tag !== 'search') {
            TagName = flows[tag]
        }

      return <TagName bus={bus}
        userFlows={userFlows}
        flows={flows}
        onPush={onPush}
        onPop={onPop}
        onUpdate={onUpdate} />
    }
}

export default class ListComponent extends Component {
  render () {
    const { stack, onPush, onPop, onUpdate, flows, userFlows } = this.props
    const uiStack = (() => {
      let uiStack = [{
        component: 'search',
        index: 0
      }]

      for (let i = 0; i < stack.length; i++) {
        let item = stack[i]

        uiStack.push({
          component: item.flow,
          bus: item.bus,
          index: i
        })

        uiStack.push({
          component: 'search',
          index: i + 1
        })
      }

      return uiStack
    })()

    return (uiStack.map((item, i) => (
      <UiComponent key={i}
        tag={item.component}
        bus={item.bus}
        flows={flows}
        userFlows={userFlows}
        onPush={component => {
          onPush(item.index, component)
        }}
        onPop={() => {
          onPop(item.index)
        }}
        onUpdate={data => {
          onUpdate(item.index, data)
        }} />
    )))
  }
}
