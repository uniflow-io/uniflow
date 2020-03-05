import React, { Component } from 'react'
import Navigation from './navigation'
import Program from './program'
import Folder from './folder'
import { getCurrentProgram } from '../../reducers/feed/actions'
import { connect } from 'react-redux'

class Feed extends Component {
  render() {
    const { flows, feed  } = this.props
    const currentProgram = getCurrentProgram(feed)

    return (
      <div className="container-fluid">
        <div className="row flex-xl-nowrap">
          <Navigation />
          {feed.username &&
            currentProgram &&
            currentProgram.type === 'program' &&
            <Program flows={flows} />
          }
          {feed.username && currentProgram === null && feed.folder &&
            <Folder />
          }
        </div>
      </div>
    )
  }
}

export default connect(state => {
  return {
    feed: state.feed,
  }
})(Feed)
