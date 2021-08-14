import React, { Component } from 'react';
import Navigation from './navigation';
import Program from './program';
import Folder from './folder';
import { getFeedItem } from '../../reducers/feed/actions';
import { connect } from 'react-redux';

class Feed extends Component {
  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'allFlows' does not exist on type 'Readon... Remove this comment to see the full error message
    const { allFlows, feed } = this.props;
    const currentItem = getFeedItem(feed);

    return (
      <div className="container-fluid">
        <div className="row flex-xl-nowrap">
          <Navigation />
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'unknown'. */}
          {currentItem && currentItem.type === 'program' && (
            // @ts-expect-error ts-migrate(2322) FIXME: Type '{ program: any; allFlows: any; }' is not ass... Remove this comment to see the full error message
            <Program program={currentItem.entity} allFlows={allFlows} />
          )}
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'unknown'. */}
          {currentItem && currentItem.type === 'folder' && <Folder folder={currentItem.entity} />}
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'feed' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    feed: state.feed,
  };
})(Feed);
