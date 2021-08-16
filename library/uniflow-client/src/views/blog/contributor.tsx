import React, { Component } from 'react';
import ArticleItem from './articleItem';
import { GatsbyImage } from 'gatsby-plugin-image';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface ContributorProps {}

class Contributor extends Component<ContributorProps> {
  render() {
    const { contributor, articles } = this.props;

    return (
      <section className="section container-fluid">
        <div className="row mb-3">
          <div className="col-sm-6 offset-sm-3">
            <div className="user">
              <div className="user-header">
                <div className="profile_pic">
                  <GatsbyImage
                    image={contributor.image.childImageSharp.gatsbyImageData}
                    alt={contributor.name}
                  />
                </div>
              </div>
              <div className="user-body">
                <div className="d-lfex justify-content-center flex-column">
                  <div className="name_container">
                    <div className="name">{contributor.name}</div>
                  </div>
                  <div className="description_container">
                    <div className="description">{contributor.description}</div>
                  </div>
                </div>
                <div className="follow">
                  <a
                    href={`https://twitter.com/${contributor.twitter.substr(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-social btn-twitter"
                  >
                    <FontAwesomeIcon icon={faTwitter} /> {contributor.twitter}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 offset-sm-3">
            <h3 className="page-header">Blog articles</h3>
            {articles.edges.map((item, i) => (
              <div className="row mb-3" key={i}>
                <div className="col-md-12">
                  <ArticleItem article={item.node} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}

export default Contributor;
