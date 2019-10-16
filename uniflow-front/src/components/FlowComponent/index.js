import React from 'react'

export default function withFlow(Component) {
  class FlowComponent extends React.Component {

    render() {
      return (
        <Component {...this.props} />
      )
    }
  }

  FlowComponent.tags = Component.tags || function () {
    return []
  }

  FlowComponent.clients = Component.clients || function () {
    return []
  }

  return FlowComponent
}
