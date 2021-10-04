import { graphql } from 'gatsby'
import Page from '@uniflow-io/uniflow-client/src/templates/doc'

export default Page;

export const query = graphql`
  query ($id: String) {
    doc: mdx(id: { eq: $id }) {
      excerpt
      body
      frontmatter {
        title
      }
      fields {
        slug
      }
      parent {
        ... on File {
          relativePath
        }
      }
    }
    docNav: allDocsYaml {
      nodes {
        title
        items {
          link
          title
        }
      }
    }
  }
`;
