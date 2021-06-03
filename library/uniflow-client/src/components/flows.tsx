import React, { Component, Suspense, lazy } from "react"
import { Search } from "."

class UiFlow extends Component {
  render() {
    const { tag, bus, onPush, onPop, onUpdate, onRun, allFlows, programFlows, clients } = this.props

    let TagName = Search
    if (tag !== "search") {
      // simple hack as webpack do not import dynamic npm modules
      const lasyImports = {
        "@uniflow-io/uniflow-flow-assets": () => import("../../../uniflow-flow-assets/src"),
        "@uniflow-io/uniflow-flow-bash": () => import("../../../uniflow-flow-bash/src"),
        "@uniflow-io/uniflow-flow-canvas": () => import("../../../uniflow-flow-canvas/src"),
        "@uniflow-io/uniflow-flow-if": () => import("../../../uniflow-flow-if/src"),
        "@uniflow-io/uniflow-flow-object": () => import("../../../uniflow-flow-object/src"),
        "@uniflow-io/uniflow-flow-javascript": () => import("../../../uniflow-flow-javascript/src"),
        "@uniflow-io/uniflow-flow-prompt": () => import("../../../uniflow-flow-prompt/src"),
        "@uniflow-io/uniflow-flow-regex": () => import("../../../uniflow-flow-regex/src"),
        "@uniflow-io/uniflow-flow-text": () => import("../../../uniflow-flow-text/src"),
        "@uniflow-io/uniflow-flow-text-list": () => import("../../../uniflow-flow-text-list/src"),
        "@uniflow-io/uniflow-flow-while": () => import("../../../uniflow-flow-while/src"),
      }
      TagName = lazy(lasyImports[tag])
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <TagName
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
    )
  }
}

export default class Flows extends Component {
  render() {
    const { flows, onPush, onPop, onUpdate, onRun, allFlows, programFlows, clients } = this.props
    const uiFlows = (() => {
      let uiFlows = [
        {
          component: "search",
          index: 0,
        },
      ]

      for (let i = 0; i < flows.length; i++) {
        let item = flows[i]

        uiFlows.push({
          component: item.flow,
          bus: item.bus,
          index: i,
        })

        uiFlows.push({
          component: "search",
          index: i + 1,
        })
      }

      return uiFlows
    })()

    return uiFlows.map((item, i) => (
      <UiFlow
        key={i}
        tag={item.component}
        bus={item.bus}
        allFlows={allFlows}
        programFlows={programFlows}
        clients={clients}
        onPush={(component) => {
          onPush(item.index, component)
        }}
        onPop={() => {
          onPop(item.index)
        }}
        onUpdate={(data) => {
          onUpdate(item.index, data)
        }}
        onRun={(event) => {
          onRun(event, item.index)
        }}
      />
    ))
  }
}
