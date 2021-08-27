import React from 'react';
import Newsletter, { NewsletterProps } from '../views/newsletter';
import { graphql, PageProps } from 'gatsby';
import { withPage } from '../helpers';

export interface NewsLetterTemplateData {
  newsletter: NewsletterProps['newsletter'];
}

export default ({ data, location }: PageProps<NewsLetterTemplateData>) => {
  const { newsletter } = data;

  const NewsletterPage = withPage<NewsletterProps>(Newsletter, 'newsletter', {
    location,
    title: newsletter.frontmatter.title,
    description: newsletter.excerpt,
  });

  return <NewsletterPage newsletter={newsletter} />;
};

export const query = graphql`
  query ($id: String) {
    newsletter: mdx(id: { eq: $id }) {
      body
      excerpt
      frontmatter {
        title
      }
      parent {
        ... on File {
          relativePath
        }
      }
    }
  }
`;
