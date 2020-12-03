import React from "react"
import { Card } from "../views"
import { graphql } from "gatsby"
import { withPage } from "../helpers"

export default ({ data, location }) => {
  const { /*library, */ localLibrary, /*card, */ localCard, logo } = data
  let realCard = {
    //...card,
    official: false,
  }
  if (localCard) {
    realCard = {
      ...localCard,
      official: true,
    }
  }

  const CardPage = withPage(Card, "card", {
    location: location,
    title: realCard.name,
    description: realCard.description,
  })

  let allLibrary = {}
  /*library.nodes.forEach(card => {
    allLibrary[card.fields.slug] = card;
  });*/
  localLibrary.nodes.forEach((card) => {
    allLibrary[card.fields.slug] = card
  })
  return <CardPage library={Object.values(allLibrary)} card={realCard} logo={logo} />
}

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
  query($slug: String) {
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
        fixed(width: 18, height: 18) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
