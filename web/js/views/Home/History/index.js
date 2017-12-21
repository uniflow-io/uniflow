import React, { Component } from 'react'

let id = 1;

export default class History extends Component {
    state = {
        search: '',
        items: {},
        current: null
    }

    onChange = (event) => {
        this.setState({search: event.target.value})
    }

    onSubmit = (event) => {
        event.preventDefault();
    }

    render() {
        return (
            <div className="box box-danger">
                <div className="box-header with-border">
                    <h3 className="box-title">History</h3>
                </div>
                <div className="box-body">
                    <div className="navbar navbar-default navbar-vertical" role="navigation">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".sidebar-navbar-collapse">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </button>
                            <span className="visible-xs navbar-brand">Sidebar menu</span>
                        </div>
                        <div className="navbar-collapse collapse sidebar-navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li>
                                    <form className="navbar-form" role="search" onSubmit={this.onSubmit}>
                                        <div className="input-group" style={{ width: '100%'}}>
                                            <input type="text" className="form-control" placeholder="Search" value={this.state.search} onChange={this.onChange} />
                                            {/*div className="input-group-btn">
                                                <button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search"></i></button>
                                            </div*/}
                                        </div>
                                    </form>
                                </li>
                                {/*<li v-for="item in filteredHistory" :className="{'active':(history && item.id == history.id)}"><router-link :to="{ name: 'homeDetail', params: { id: item.id }}">{{ item.title }} <span v-for="tag in item.tags" className="badge">{{ tag }}</span></router-link></li>*/}
                            </ul>
                        </div>{/*/.nav-collapse */}
                    </div>
                </div>
            </div>
        )
    }
}
