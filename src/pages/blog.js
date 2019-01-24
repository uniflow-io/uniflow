import React, {Component} from 'react'
import {pathTo} from '../routes'
import {Link} from 'gatsby'
import {getBlog} from '../reducers/blog/actions'
import {connect} from 'react-redux'
import {BlogParagraph} from '../components'
import moment from 'moment'
import Layout from "../layouts";

class Blog extends Component {
  state = {
    blog: {}
  }

  componentDidMount() {
    this.onFetchFlowData()
  }

  onFetchFlowData = () => {
    this.props.dispatch(getBlog())
      .then((blog) => {
        this.setState({blog: blog})
      })
  }

  render() {
    const {blog} = this.state

    return (
      <Layout location={this.props.location}>
        <div id='blog' className='content-wrapper'>
          <section className='content-header'>
            <h1>
              Blog
              <small>Control panel</small>
            </h1>
            <ol className='breadcrumb'>
              <li><Link to={pathTo('blog')}><i className='fa fa-dashboard'/> Blog</Link></li>
            </ol>
          </section>

          <section className='content'>
            {Object.keys(blog).map((item, i) => ([
              <Link to={pathTo('article', {slug: blog[item].slug})} key={i}>
                <div className='row'>
                  <div className='col-sm-6 col-sm-offset-3'>
                    <div className='box box-success'>
                      <div className='box-header with-border'>
                        <h3 className='box-title'>{moment(blog[item].firstPublishedAt, 'x').format('MMMM Do YYYY')}</h3>
                      </div>
                      <div className='box-body'>
                        {blog[item].previewContent.bodyModel.paragraphs.map((paragraph, j) => ([
                          <BlogParagraph key={j} data={paragraph}/>
                        ]))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ]))}
          </section>
        </div>
      </Layout>
    )
  }
}

export default connect(() => {
  return {}
})(Blog)
