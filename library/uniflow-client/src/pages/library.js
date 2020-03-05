import React from 'react'
import { Library } from '../views'
import { withPage } from '../helpers'
import { graphql } from 'gatsby'

export default ({ location, data: { library, localLibrary } }) => {
  let allLibrary = {}
  library.nodes.forEach(card => {
    allLibrary[card.fields.slug] = card;
  });
  localLibrary.nodes.forEach(card => {
    allLibrary[card.fields.slug] = card;
  });

  const LibraryPage = withPage(Library, 'library', {
    location: location,
    title: 'Library',
    description: 'Library',
  })

  return <LibraryPage library={Object.values(allLibrary)} />
}

export const query = graphql`
  query {
    library: allNpmPackage(filter: {deprecated: {eq: "false"}}) {
      nodes {
        name
        description
        fields {
          slug
          catalogs
        }
      }
    },
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
`
