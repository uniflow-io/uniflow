import React, { Component } from 'react'
import {connect} from 'react-redux'
import {fetchHistory} from 'uniflow/reducers/history/actions'

type Props = {
    children: React.Node
}

class HistoryManager extends Component<Props> {
  componentDidMount() {
    this.props.dispatch(fetchHistory())
  }

  render() {
    return (<div />)
  }
}

export default connect()(HistoryManager)