import React from 'react';
import Library, { LibraryProps } from '../views/library/library';
import { withPage } from '../helpers';
import { graphql, PageProps } from 'gatsby';
import { Card } from '../views/library/navigation';

export interface LibraryPageData {
  localLibrary: {
    nodes: Card[]
  }
}

export default ({ location, data: { /*library, */ localLibrary } }: PageProps<LibraryPageData>) => {
  const allLibrary = {};
  /*library.nodes.forEach(card => {
    allLibrary[card.fields.slug] = card;
  });*/
  localLibrary.nodes.forEach((card) => {
    allLibrary[card.fields.slug] = card;
  });

  const LibraryPage = withPage<LibraryProps>(Library, 'library', {
    location,
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
