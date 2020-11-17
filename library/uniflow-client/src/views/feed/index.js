import React, { Component } from 'react'
import Navigation from './navigation'
import Program from './program'
import Folder from './folder'
import { getCurrentFeedItem } from '../../reducers/feed/actions'
import { connect } from 'react-redux'

class Feed extends Component {
  render() {
    const { flows, feed } = this.props
    const currentItem = getCurrentFeedItem(feed)

    return (
      <div className="container-fluid">
        <div className="row flex-xl-nowrap">
          <Navigation />
          {currentItem && currentItem.type === 'program' &&
            <Program program={currentItem.entity} flows={flows} />
          }
          {!currentItem && feed.parentFolder && feed.parentFolder.slug === feed.slug &&
            <Folder folder={feed.parentFolder} />
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
