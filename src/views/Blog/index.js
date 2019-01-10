import React, {Component} from 'react'
import {pathTo} from "../../routes";
import {Link} from "react-router-dom";
import {getBlog} from "../../reducers/blog/actions";
import {connect} from 'react-redux'
import Paragraph from './paragraph'

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
        const { blog } = this.state

        return (
            <div id="blog" className="content-wrapper">
                <section className="content-header">
                    <h1>
                        Blog
                        <small>Control panel</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><Link to={pathTo('blog')}><i className="fa fa-dashboard"/> Blog</Link></li>
                    </ol>
                </section>

                <section className="content">
                    {Object.keys(blog).map((item, i) => ([
                    <Link to={pathTo('article', {slug: blog[item].slug})} key={i}>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="box box-success">
                                    <div className="box-body">
                                        {blog[item].previewContent.bodyModel.paragraphs.map((paragraph, j) => ([
                                            <Paragraph key={j} data={paragraph} />
                                        ]))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                    ]))}
                </section>
            </div>
        )
    }

}

export default connect(() => {
    return {}
})(Blog)
