import React from 'react';
import Article, { ArticleProps } from '../views/blog/article';
import { graphql, PageProps } from 'gatsby';
import { withPage } from '../helpers';

export interface ArticleTemplateData {
  article: ArticleProps['article']
}

export interface ArticleTemplateContext {
  previous: ArticleProps['previous'],
  next: ArticleProps['next'],
}

export default ({ data, location, pageContext: { previous, next } }: PageProps<ArticleTemplateData, ArticleTemplateContext>) => {
  const { article } = data;

  const ArticlePage = withPage<ArticleProps>(Article, 'article', {
    location,
    title: article.frontmatter.title,
    description: article.excerpt,
    image: article.frontmatter.coverSeo.publicURL,
    type: 'article',
  });

  return <ArticlePage article={article} previous={previous} next={next} />;
};

export const query = graphql`
  query ($id: String) {
    article: mdx(id: { eq: $id }) {
      body
      timeToRead
      excerpt
      frontmatter {
        title
        author {
          fields {
            slug
          }
          name
          image {
            childImageSharp {
              gatsbyImageData(width: 36, height: 36, layout: FIXED)
            }
          }
        }
        cover {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
          extension
          publicURL
        }
        coverSeo {
          publicURL
        }
        coverAuthor
        coverOriginalUrl
        tags
        date(formatString: "MMMM Do YYYY")
      }
      parent {
        ... on File {
          relativePath
        }
      }
    }
  }
`;
