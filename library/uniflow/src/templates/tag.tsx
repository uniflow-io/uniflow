import { graphql } from 'gatsby'
import Page from '@uniflow-io/uniflow-client/src/templates/tag'

export default Page;

export const query = graphql`
  query ($tag: String) {
    articles: allMdx(
      filter: { fields: { sourceName: { eq: "blog" } }, frontmatter: { tags: { eq: $tag } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          ...ArticleItemFragment
        }
      }
    }
  }
`;
