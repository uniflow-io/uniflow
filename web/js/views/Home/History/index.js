import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {pathTo} from 'uniflow/routes'
import moment from 'moment'

let id = 2;

export default class History extends Component {
    state = {
        search: '',
        items: {
            1: {
                id: 1,
                title: 'coucou',
                tags: ['deed'],
                description: 'description',
                updated: moment()
            }
        },
        current: null
    }

    onChange = (event) => {
        this.setState({search: event.target.value})
    }

    onSubmit = (event) => {
        event.preventDefault();

        let item = {}
        item[id] = {
            id: id,
            title: this.state.search,
            tags: ['deed'],
            description: 'description',
            updated: moment()
        }

        this.setState({items: {...this.state.items, ...item}})

        id++;
    }

    render() {
        const filteredHistory = (state) => {
            let keys = Object.keys(state.items);

            if (state.search) {
                keys = keys.filter((key) => {
                    let item  = state.items[key];
                    let words = item.title;
                    for(let i = 0; i < item.tags.length; i++) {
                        words += ' ' + item.tags[i];
                    }
                    words = words.toLowerCase();

                    return words.indexOf(state.search) !== -1;
                });
            }

            keys.sort((keyA, keyB) => {
                let itemA = state.items[keyA],
                    itemB = state.items[keyB];

                return itemB.updated.diff(itemA.updated);
            });

            return keys.map((key) => {
                return state.items[key];
            });
        }

        const isActive = (state, item) => {
            return (state.current && state.curent.id === item.id) ? 'active' : ''
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
                        <div className="navbar-collapse collapse sidebar-navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li>
                                    <form className="navbar-form" role="search" onSubmit={this.onSubmit}>
                                        <div className="input-group" style={{width: '100%'}}>
                                            <input type="text" className="form-control" placeholder="Search"
                                                   value={this.state.search} onChange={this.onChange}/>
                                            {/*div className="input-group-btn">
                                                <button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search"></i></button>
                                            </div*/}
                                        </div>
                                    </form>
                                </li>
                                {filteredHistory(this.state).map((item, i) => (
                                    <li className={isActive(this.state, item)} key={i}>
                                        <Link
                                            to={pathTo('homeDetail', {id: item.id})}>{item.title} {item.tags.map((tag, j) => (
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
