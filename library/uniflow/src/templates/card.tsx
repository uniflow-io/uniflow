import React from 'react';
import Card, { CardProps } from '../views/library/card';
import { graphql, PageProps } from 'gatsby';
import { withPage } from '../helpers';

export interface CardTemplateData {
  logo: CardProps['logo'];
  localLibrary: {
    nodes: CardProps['library'];
  };
  localCard: CardProps['card'];
}

export default ({ data, location }: PageProps<CardTemplateData>) => {
  const { /*library, */ localLibrary, /*card, */ localCard, logo } = data;
  let realCard: CardProps['card'] = {
    //...card,
    ...localCard,
    official: false,
  };
  if (localCard) {
    realCard = {
      ...localCard,
      official: true,
    };
  }

  const CardPage = withPage<CardProps>(Card, 'card', {
    location,
    title: realCard.name,
    description: realCard.description,
  });

  const allLibrary = {};
  /*library.nodes.forEach(card => {
    allLibrary[card.fields.slug] = card;
  });*/
  localLibrary.nodes.forEach((card) => {
    allLibrary[card.fields.slug] = card;
  });
  return <CardPage library={Object.values(allLibrary)} card={realCard} logo={logo} />;
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
    }
    card: npmPackage(fields: { slug: { eq: $slug } }) {
      name
      description
      fields {
        slug
        catalogs
      }
      readme {
        childMdx {
          body
        }
      }
      repository {
        url
      }
    }
*/

export const query = graphql`
  query ($slug: String) {
    localCard: npmLocalPackage(fields: { slug: { eq: $slug } }) {
      name
      description
      fields {
        slug
        catalogs
      }
      readme {
        childMdx {
          body
        }
      }
      repository {
        url
        directory
      }
    }
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
    logo: file(sourceInstanceName: { eq: "images" }, relativePath: { eq: "logo.png" }) {
      publicURL
      childImageSharp {
        gatsbyImageData(width: 18, height: 18, layout: FIXED)
      }
    }
  }
`;
