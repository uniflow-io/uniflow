import React from 'react';
import Navigation from './navigation';
import Program, { ProgramProps } from './program';
import Folder from './folder';
import { FolderFeedType, getFeedItem, ProgramFeedType, useFeed } from '../../contexts/feed';
import { FC } from 'react';

export interface FeedProps {
  allFlows: ProgramProps['allFlows'];
}

const Feed: FC<FeedProps> = (props) => {
  const { allFlows } = props;
  const { feed } = useFeed();
  const currentItem = getFeedItem(feed);

  return (
    <div className="container-fluid">
      <div className="row flex-sm-nowrap">
        <Navigation type={currentItem && currentItem.type} />
        {currentItem && currentItem.type === 'program' && (
          <Program program={currentItem.entity as ProgramFeedType} allFlows={allFlows} />
        )}
        {currentItem && currentItem.type === 'folder' && (
          <Folder folder={currentItem.entity as FolderFeedType} />
        )}
      </div>
    </div>
  );
};

export default Feed;
