import React, {Component} from 'react'
import {pathTo} from "../../../routes";
import {Link} from "react-router-dom";
import {getArticle} from "../../../reducers/blog/actions";
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import Paragraph from './../paragraph'

class Article extends Component {
    state = {
        article: null
    }

    componentDidMount() {
        this.onFetchFlowData()
    }

    onFetchFlowData = () => {
        const { match } = this.props;

        this.props.dispatch(getArticle(match.params.slug))
            .then((article) => {
                this.setState({article: article})
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
                        <li><Link to={pathTo('home')}><i className="fa fa-dashboard"/> Home</Link></li>
                        <li><Link to={pathTo('blog')}>Blog</Link></li>
                        <li className="active">Article</li>
                    </ol>
                </section>

                <section className="content">
                    {article && article.content.bodyModel.paragraphs.map((paragraph, j) => ([
                        <Paragraph key={j} data={paragraph} />
                    ]))}
                </section>
            </div>
        )
    }

}

export default connect(() => {
    return {}
})(withRouter(Article))
