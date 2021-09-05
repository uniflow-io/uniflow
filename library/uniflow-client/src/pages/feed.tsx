import React, { FC } from 'react';
import { graphql, PageProps } from 'gatsby';
import Feed, { FeedProps } from '../views/feed/feed';
import { requireAuthentication, withPage } from '../helpers';
import routes from '../routes';
import { Path } from '../services';
import Container from '../container';
import { FlowMetadata } from '../components/flow/flow';

const container = new Container();
const path = container.get(Path);

export interface FeedPageData {
  localFlows: {
    nodes: {
      name: string;
      uniflow: FlowMetadata;
    }[];
  };
}

const Page: FC<PageProps<FeedPageData>> = ({ location, data: { localFlows } }) => {
  const allFlows = {};
  localFlows.nodes.forEach((flow) => {
    allFlows[flow.name] = flow.uniflow;
  });

  const FeedPage = withPage<FeedProps>(Feed, 'feed', {
    location,
    title: 'Feed',
    description: 'Feed',
  });
  const AuthFeedPage = requireAuthentication<FeedProps>(FeedPage);

  const match = path.matchPath(location.pathname, {
    path: routes.feed.path,
    exact: true,
  });
  if (match) {
    return <AuthFeedPage allFlows={allFlows} />;
  }

  return <FeedPage allFlows={allFlows} />;
};

export const query = graphql`
  query {
    localFlows: allNpmLocalPackage(filter: { fields: { catalogs: { in: "flow" } } }) {
      nodes {
        name
        uniflow {
          clients
          name
          tags
        }
      }
    }
  }
`;

export default Page;
