import { graphql } from 'gatsby'
import Page from '@uniflow-io/uniflow-client/src/templates/card'

export default Page;

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
