import React, { Component } from 'react'
import Navigation from './navigation'
import Program from './program'
import Folder from './folder'
import { getCurrentItem } from '../../reducers/feed/actions'
import { connect } from 'react-redux'

class Feed extends Component {
  render() {
    const { flows, feed } = this.props
    const item = getCurrentItem(feed)

    return (
      <div className="container-fluid">
        <div className="row flex-xl-nowrap">
          <Navigation />
          {item && item.type === 'program' &&
            <Program program={item.entity} flows={flows} />
          }
          {item && item.type === 'folder' &&
            <Folder folder={item.entity} />
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
