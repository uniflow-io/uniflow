import React from 'react';
import { Tag } from '../views';
import { graphql } from 'gatsby';
import { withPage } from '../helpers';

export default ({ data, location, pageContext: { tag } }) => {
  const { articles } = data;

  const TagPage = withPage(Tag, 'tag', {
    location: location,
    title: tag,
    description: tag,
  });

  return <TagPage tag={tag} articles={articles} />;
};

export const query = graphql`
  query ($tag: String) {
    articles: allMdx(
      filter: { fields: { sourceName: { eq: "blog" } }, frontmatter: { tags: { eq: $tag } } }
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
