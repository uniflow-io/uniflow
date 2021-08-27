import React from 'react';
import Contributor, { ContributorProps } from '../views/blog/contributor';
import { graphql, PageProps } from 'gatsby';
import { withPage } from '../helpers';

export interface ContributorTemplateData {
  contributor: ContributorProps['contributor'];
  articles: ContributorProps['articles'];
}

export default ({ data, location }: PageProps<ContributorTemplateData>) => {
  const { contributor } = data;

  const ContributorPage = withPage<ContributorProps>(Contributor, 'contributor', {
    location,
    title: contributor.name,
    description: contributor.description,
    image: contributor.image.publicURL,
  });

  return <ContributorPage contributor={contributor} articles={data.articles} />;
};

export const query = graphql`
  query ($slug: String) {
    contributor: contributorsYaml(fields: { slug: { eq: $slug } }) {
      name
      description
      twitter
      image {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
        publicURL
      }
    }
    articles: allMdx(
      filter: {
        fields: { sourceName: { eq: "blog" } }
        frontmatter: { author: { fields: { slug: { eq: $slug } } } }
      }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          ...ArticleItemFragment
        }
      }
    }
  }
`;
