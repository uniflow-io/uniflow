import React, {Component} from 'react'
import Layout from '../layouts'
import {pathTo} from '../routes'
import {Link} from 'gatsby'
import {getLastPublicProgram, feedPathTo} from '../reducers/feed/actions'
import {connect} from "react-redux";

class Home extends Component {
    state = {
        flow: []
    }

    componentDidMount() {
        this.onFetchFlowData()
    }

    onFetchFlowData = () => {
        this.props.dispatch(getLastPublicProgram())
            .then((flow) => {
                this.setState({flow: flow})
            })
    }

    itemPathTo = (item) => {
        let path = item.path.slice()
        path.push(item.slug)

        return feedPathTo(path, item.username)
    }

    render() {
        const {flow} = this.state

        return (
            <Layout>
                <div id='home' className='content-wrapper'>
                    <section className='content-header'>
                        <h1>
                            Home
                            <small>Control panel</small>
                        </h1>
                        <ol className='breadcrumb'>
                            <li><Link to={pathTo('home')}><i className='fa fa-dashboard'/> Home</Link></li>
                        </ol>
                    </section>

                    <section className='content'>
                        <div className='row'>
                            <div className='col-sm-12'>
                                <div className='box box-danger'>
                                    <div className='box-header with-border'>
                                        <h3 className='box-title'>Public Flows</h3>
                                    </div>
                                    <div className='box-body'>
                                        <dl className='dl-horizontal'>
                                            {flow.map((item, i) => ([
                                                <dt key={i * 2}><Link
                                                    to={this.itemPathTo(item)}>{item.title}</Link></dt>,
                                                <dd key={i * 2 + 1}>{item.description}</dd>
                                            ]))}
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </Layout>
        )
    }
}

export default connect(() => {
    return {}
})(Home)
