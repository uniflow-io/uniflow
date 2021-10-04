import { graphql } from 'gatsby'
import Page from '@uniflow-io/uniflow-client/src/templates/contributor'

export default Page;

export const query = graphql`
  query ($slug: String) {
    contributor: contributorsYaml(fields: { slug: { eq: $slug } }) {
      name
      description
      twitter
      image {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
        publicURL
      }
    }
    articles: allMdx(
      filter: {
        fields: { sourceName: { eq: "blog" } }
        frontmatter: { author: { fields: { slug: { eq: $slug } } } }
      }
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
