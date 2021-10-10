import { graphql } from 'gatsby';

import Page from '@uniflow-io/uniflow-client/src/pages/library'

export const query = graphql`
  query {
    localLibrary: allNpmLocalPackage {
      nodes {
        name
        description
        fields {
          slug
          catalogs
        }
      }
    }
  }
`;

export default Page;
