import React from 'react';
import { pathTo } from '../../routes';
import { Link, graphql } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface ArticleItemProps {
  article: {
    fields: {
      slug: string
    }
    excerpt: string
    frontmatter: {
      title: string
      author: {
        fields: {
          slug: string
        }
        name: string
        image: {
          childImageSharp: {
            gatsbyImageData: IGatsbyImageData
          }
        }
      }
      cover: {
        childImageSharp: {
          gatsbyImageData: IGatsbyImageData
        }
        extension: string
        publicURL: string
      }
      tags: string[]
      date: string
    }
    timeToRead: string
  }
}

const ArticleItem = ({ article }: ArticleItemProps) => (
  <div className="card card-link">
    <Link className="btn btn-default" to={pathTo('article', { slug: article.fields.slug })}>
      Read More
    </Link>
    {(article.frontmatter.cover.childImageSharp && (
      <GatsbyImage
        image={article.frontmatter.cover.childImageSharp.gatsbyImageData}
        className="card-img-top"
        style={{ maxHeight: '50vh' }}
        alt="Cover"
        width="100%"
      />
    )) ||
      (article.frontmatter.cover.extension === 'svg' && (
        <img
          className="card-img-top"
          src={article.frontmatter.cover.publicURL}
          style={{ maxHeight: '50vh' }}
          alt="Cover"
        />
      ))}
    <div className="card-body">
      <h4 className="card-title text-center">{article.frontmatter.title}</h4>
      <p className="card-text text-center">{article.excerpt}</p>
      <div className="row pt-1">
        <div className="col-auto">
          <small>
            Posted {article.frontmatter.date} by
            <GatsbyImage
              image={article.frontmatter.author.image.childImageSharp.gatsbyImageData}
              width="36"
              height="36"
              alt={article.frontmatter.author.name}
              className="rounded-circle mx-2"
              style={{ verticalAlign: 'middle', display: 'inline-block' }}
            />
            <Link
              to={pathTo('contributor', {
                slug: article.frontmatter.author.fields.slug,
              })}
            >
              {article.frontmatter.author.name}
            </Link>
            <span> - </span>
            <i>{article.timeToRead} min read</i>
          </small>
        </div>
        <div className="col-auto ms-auto">
          {article.frontmatter.tags.map((tag, k) => (
            <Link to={pathTo('tag', { tag: tag })} key={k} className="btn btn-sm btn-primary">
              <FontAwesomeIcon icon={faTag} /> {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const query = graphql`
  fragment ArticleItemFragment on Mdx {
    fields {
      slug
    }
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
      tags
      date(formatString: "MMMM Do YYYY")
    }
    timeToRead
  }
`;

export default ArticleItem;
