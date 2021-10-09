import React from 'react';
import Doc, { DocProps } from '@uniflow-io/uniflow-client/src/views/doc/doc';
import { graphql, PageProps } from 'gatsby';
import { withPage } from '@uniflow-io/uniflow-client/src/helpers';

export interface DocTemplateData {
  doc: DocProps['doc'];
  docNav: DocProps['docNav'];
}

export interface DocTemplateContext {
  previous: DocProps['previous'];
  next: DocProps['next'];
}

export default ({
  data,
  location,
  pageContext: { previous, next },
}: PageProps<DocTemplateData, DocTemplateContext>) => {
  const { doc, docNav } = data;

  const DocPage = withPage<DocProps>(Doc, 'doc', {
    location,
    title: doc.frontmatter.title,
    description: doc.excerpt,
  });

  return <DocPage doc={doc} docNav={docNav} previous={previous} next={next} />;
};

export const query = graphql`
  query ($id: String) {
    doc: mdx(id: { eq: $id }) {
      excerpt
      body
      frontmatter {
        title
      }
      fields {
        slug
      }
      parent {
        ... on File {
          relativePath
        }
      }
    }
    docNav: allDocsYaml {
      nodes {
        title
        items {
          link
          title
        }
      }
    }
  }
`;
