import React, { Component } from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { GatsbyImage } from 'gatsby-plugin-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import Navigation from './navigation';
import { MDXProvider } from '../../components';

export interface CardProps {}

class Card extends Component<CardProps> {
  render() {
    const { library, card, logo } = this.props;
    let repository = card.repository.url;
    let editUrl = null;
    if (card.official) {
      repository = `https://github.com/uniflow-io/uniflow/tree/1.x/${card.repository.directory}`;
      editUrl = `https://github.com/uniflow-io/uniflow/blob/1.x/${card.repository.directory}/README.md`;
    }

    return (
      <div className="container-fluid">
        <div className="row flex-xl-nowrap">
          <Navigation library={library} slug={card.fields.slug} />
          <section className="section col">
            <div className="row mb-3">
              <div className="col-sm-12">
                <div className="row text-secondary">
                  <div className="col-auto me-auto">
                    <p>
                      <a href={repository} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGithub} /> View on GitHub
                      </a>
                    </p>
                  </div>
                  <div className="col-auto">
                    {card.fields.catalogs.map((catalog, j) => (
                      <span key={j} className="badge badge-light mr-1">
                        {catalog}
                      </span>
                    ))}
                  </div>
                  {card.official && (
                    <div className="col-auto">
                      <span>
                        <GatsbyImage
                          image={logo.childImageSharp.gatsbyImageData}
                          width="18"
                          height="18"
                          className="svg-inline--fa"
                          alt="Uniflow"
                        />{' '}
                        Official
                      </span>
                    </div>
                  )}
                </div>
                <MDXProvider>
                  <MDXRenderer>{card.readme.childMdx.body}</MDXRenderer>
                </MDXProvider>
                {editUrl && (
                  <p>
                    <a href={editUrl} target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faEdit} /> Edit this page on GitHub
                    </a>
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Card;
