import React from 'react'
import { Doc } from '../views'
import { graphql } from 'gatsby'
import { withPage } from '../helpers'

export default ({ data, location, pageContext: { previous, next } }) => {
  const { doc, docNav } = data

  const DocPage = withPage(Doc, 'doc', {
    location: location,
    title: doc.frontmatter.title,
    description: doc.excerpt,
  })

  return <DocPage doc={doc} docNav={docNav} previous={previous} next={next} />
}

export const query = graphql`
  query($id: String) {
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
`
