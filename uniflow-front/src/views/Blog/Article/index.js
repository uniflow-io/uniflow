import React, { Component } from 'react'
import { pathTo } from '../../../routes'
import { Link } from 'gatsby'
import { getArticle } from '../../../reducers/blog/actions'
import { connect } from 'react-redux'
import Paragraph from './../paragraph'
import moment from 'moment'

class Article extends Component {
  state = {
    article: null,
  }

  componentDidMount() {
    this.onFetchFlowData()
  }

  onFetchFlowData = () => {
    const { slug } = this.props

    this.props.dispatch(getArticle(slug)).then(article => {
      this.setState({ article: article })
    })
  }

  render() {
    const { article } = this.state

    return (
      <div id="blog" className="content-wrapper">
        <section className="content-header">
          <h1>
            Article
            <small>Control panel</small>
          </h1>
          <ol className="breadcrumb">
            <li>
              <Link to={pathTo('home')}>
                <i className="fa fa-dashboard" /> Home
              </Link>
            </li>
            <li>
              <Link to={pathTo('blog')}>Blog</Link>
            </li>
            <li className="active">Article</li>
          </ol>
        </section>

        {article && (
          <section className="content">
            <div className="row">
              <div className="col-sm-6 col-sm-offset-3">
                <div className="box box-success">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      {moment(article.firstPublishedAt, 'x').format(
                        'MMMM Do YYYY'
                      )}
                    </h3>
                  </div>
                  <div className="box-body">
                    {article.content.bodyModel.paragraphs.map(
                      (paragraph, j) => [
                        <Paragraph key={j} data={paragraph} headline={false} />,
                      ]
                    )}
                  </div>
                  <div className="box-footer text-center">
                    {article.virtuals.tags.map((tag, k) => [
                      <span key={k} className="label label-success pull-right">
                        {tag.name}
                      </span>,
                    ])}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    )
  }
}

export default connect(() => {
  return {}
})(Article)
