import React from 'react'
import { pathTo } from '../../routes'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ArticleItem = ({ article }) => (
  <div className="card card-link">
    <Link
      className="btn btn-default"
      to={pathTo('article', { slug: article.fields.slug })}
    >
      Read More
    </Link>
    {(article.frontmatter.cover.childImageSharp && (
      <Img
        className="card-img-top"
        fluid={article.frontmatter.cover.childImageSharp.fluid}
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
        <div className="col-auto mr-auto">
          <small>
            Posted {article.frontmatter.date} by
            <Img
              fixed={article.frontmatter.author.image.childImageSharp.fixed}
              width="36"
              height="36"
              alt={article.frontmatter.author.name}
              className="rounded-circle mx-2"
              style={{ verticalAlign: 'middle' }}
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
        <div className="col-auto">
          {article.frontmatter.tags.map((tag, k) => (
            <Link
              to={pathTo('tag', { tag: tag })}
              key={k}
              className="btn btn-sm btn-success"
            >
              <FontAwesomeIcon icon={faTag} /> {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
)

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
            fixed(width: 36, height: 36) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
      cover {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
        extension
        publicURL
      }
      tags
      date(formatString: "MMMM Do YYYY")
    }
    timeToRead
  }
`

export default ArticleItem
