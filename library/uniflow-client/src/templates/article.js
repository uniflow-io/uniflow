import React from 'react'
import { Article } from '../views'
import { graphql } from 'gatsby'
import { withPage } from '../helpers'

export default ({ data, location, pageContext: { previous, next } }) => {
  const { article } = data

  const ArticlePage = withPage(Article, 'article', {
    location: location,
    title: article.frontmatter.title,
    description: article.excerpt,
    image: article.frontmatter.coverSeo.publicURL,
    type: 'article',
  })

  return <ArticlePage article={article} previous={previous} next={next} />
}

export const query = graphql`
  query($id: String) {
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
              fixed(width: 36, height: 36) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
        cover {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
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
    }
  }
`
