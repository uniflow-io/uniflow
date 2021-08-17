import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { MDXProvider } from '../components';

export interface NewsletterProps {
  newsletter: {
    body: string
    excerpt: string
    frontmatter: {
      title: string
    }
    parent: {
      relativePath: string
    }
  }
}

function Newsletter(props: NewsletterProps) {
  const { newsletter } = props;

  return (
    <div className="container-fluid">
      <div className="row flex-xl-nowrap">
        <section className="section col">
          <h3 className="mb-3">{newsletter.frontmatter.title}</h3>

          <div className="row mb-3">
            <div className="col-sm-12">
              <MDXProvider>
                <MDXRenderer>{newsletter.body}</MDXRenderer>
              </MDXProvider>
              <p>
                <a
                  href={`https://github.com/uniflow-io/uniflow/blob/1.x/docs/newsletters/${newsletter.parent.relativePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit this page on GitHub
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Newsletter;
