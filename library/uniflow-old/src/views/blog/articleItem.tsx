import { graphql } from 'gatsby';

export const query = graphql`
  fragment ArticleItemFragment on Mdx {
    fields {
      slug
    }
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
      tags
      date(formatString: "MMMM Do YYYY")
    }
    timeToRead
  }
`;