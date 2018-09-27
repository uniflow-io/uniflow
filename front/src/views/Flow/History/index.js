import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {pathTo} from '../../../routes'
import {connect} from 'react-redux'
import {getOrderedHistory, createHistory, setCurrentHistory} from '../../../reducers/history/actions'
import {commitAddLog} from '../../../reducers/log/actions'

class History extends Component {
    state = {
        search: ''
    }

    onChange = (event) => {
        this.setState({search: event.target.value})
    }

    onSubmit = (event) => {
        event.preventDefault();

        this.props
            .dispatch(createHistory({
                'title': this.state.search,
                'platform': 'uniflow',
                'tags': [],
                'description': ''
            }, this.props.auth.token))
            .then((item) => {
                return this.props.dispatch(setCurrentHistory(item.id))
            })
            .catch((log) => {
                return this.props.dispatch(commitAddLog(log.message))
            })
    }

    render() {
        const isActive = (history, item) => {
            return (history.current === item.id) ? 'active' : ''
        }

        return (
            <div className="box box-danger">
                <div className="box-header with-border">
                    <h3 className="box-title">History</h3>
                </div>
                <div className="box-body">
                    <div className="navbar navbar-default navbar-vertical" role="navigation">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse"
                                    data-target=".sidebar-navbar-collapse">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"/>
                                <span className="icon-bar"/>
                                <span className="icon-bar"/>
                            </button>
                            <span className="visible-xs navbar-brand">Sidebar menu</span>
                        </div>
                        <div className="navbar-collapse collapse sidebar-navbar-collapse show">
                            <ul className="nav navbar-nav">
                                <li>
                                    <form className="navbar-form" role="search" onSubmit={this.onSubmit}>
                                        <div className="input-group" style={{width: '100%'}}>
                                            <input type="text" className="form-control" placeholder="Search"
                                                   value={this.state.search} onChange={this.onChange}/>
                                            {/*div className="input-group-btn">
                                                <button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search" /></button>
                                            </div*/}
                                        </div>
                                    </form>
                                </li>
                                {getOrderedHistory(this.props.history, this.state.search).map((item, i) => (
                                    <li className={isActive(this.props.history, item)} key={i}>
                                        <Link
                                            to={pathTo('flow', {slug: item.slug})}>{item.title} {item.tags.map((tag, j) => (
                                            <span key={j} className="badge">{tag}</span>
                                        ))}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/*/.nav-collapse */}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    auth: state.auth,
    history: state.history
}))(History)
