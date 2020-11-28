import React from 'react'
import { Newsletter } from '../views'
import { graphql } from 'gatsby'
import { withPage } from '../helpers'

export default ({ data, location }) => {
  const { newsletter } = data

  const NewsletterPage = withPage(Newsletter, 'newsletter', {
    location: location,
    title: newsletter.frontmatter.title,
    description: newsletter.excerpt,
  })

  return <NewsletterPage newsletter={newsletter} />
}

export const query = graphql`
  query($id: String) {
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
`
