import { graphql } from 'gatsby'
import Page from '@uniflow-io/uniflow-client/src/templates/article'

export default Page;

export const query = graphql`
  query ($id: String) {
    article: mdx(id: { eq: $id }) {
      body
      timeToRead
      excerpt
      frontmatter {
        title
        author {
          fields {
            slug
          }
          name
          image {
            childImageSharp {
              gatsbyImageData(width: 36, height: 36, layout: FIXED)
            }
          }
        }
        cover {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
          extension
          publicURL
        }
        coverSeo {
          publicURL
        }
        coverAuthor
        coverOriginalUrl
        tags
        date(formatString: "MMMM Do YYYY")
      }
      parent {
        ... on File {
          relativePath
        }
      }
    }
  }
`;
