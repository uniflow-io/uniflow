import { graphql } from 'gatsby';

import Page from '@uniflow-io/uniflow-client/src/pages/feed'

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
