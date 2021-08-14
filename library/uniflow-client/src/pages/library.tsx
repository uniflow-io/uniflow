import React from 'react';
import { Library } from '../views';
import { withPage } from '../helpers';
import { graphql } from 'gatsby';

export default ({ location, data: { /*library, */ localLibrary } }) => {
  const allLibrary = {};
  /*library.nodes.forEach(card => {
    allLibrary[card.fields.slug] = card;
  });*/
  localLibrary.nodes.forEach((card) => {
    allLibrary[card.fields.slug] = card;
  });

  const LibraryPage = withPage(Library, 'library', {
    location: location,
    title: 'Library',
    description: 'Library',
  });

  return <LibraryPage library={Object.values(allLibrary)} />;
};

/*
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
*/

export const query = graphql`
  query {
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
`;
