import { graphql } from 'gatsby'
import Page from '@uniflow-io/uniflow-client/src/templates/newsletter'

export default Page;

export const query = graphql`
  query ($id: String) {
    newsletter: mdx(id: { eq: $id }) {
      body
      excerpt
      frontmatter {
        title
      }
      parent {
        ... on File {
          relativePath
        }
      }
    }
  }
`;
