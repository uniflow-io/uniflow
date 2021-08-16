import React, { Component } from 'react';
import { Link } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navigation from './navigation';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { pathTo } from '../../routes';
import { MDXProvider } from '../../components';

export interface DocProps {}

class Doc extends Component<DocProps> {
  render() {
    const { doc, docNav, previous, next } = this.props;

    return (
      <div className="container-fluid">
        <div className="row flex-xl-nowrap">
          <Navigation docNav={docNav} slug={doc.fields.slug} />
          <section className="section col">
            <h3 className="mb-3">{doc.frontmatter.title}</h3>

            <div className="row mb-3">
              <div className="col-sm-12">
                <MDXProvider>
                  <MDXRenderer>{doc.body}</MDXRenderer>
                </MDXProvider>
                <p>
                  <a
                    href={`https://github.com/uniflow-io/uniflow/blob/1.x/docs/docs/${doc.parent.relativePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit this page on GitHub
                  </a>
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col-auto me-auto">
                {previous && (
                  <Link
                    to={pathTo('doc', previous.fields.slug ? { slug: previous.fields.slug } : {})}
                    className="pull-left"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} /> {previous.frontmatter.title}
                  </Link>
                )}
              </div>
              <div className="col-auto">
                {next && (
                  <Link
                    to={pathTo('doc', next.fields.slug ? { slug: next.fields.slug } : {})}
                    className="pull-right"
                  >
                    {next.frontmatter.title} <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Doc;
