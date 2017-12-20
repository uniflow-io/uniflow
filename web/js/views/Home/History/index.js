import React from 'react'

export default () => (
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
                            {/*<form className="navbar-form" role="search" @submit.prevent="onSearch">
                            <div className="input-group" style="width: 100%">
                                <input type="text" className="form-control" v-model="search" placeholder="Search" name="q" />*/}
                                {/*div className="input-group-btn">
                                    <button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search"></i></button>
                                </div*/}
                            {/*</div>
                            </form>*/}
                        </li>
                        {/*<li v-for="item in filteredHistory" :className="{'active':(history && item.id == history.id)}"><router-link :to="{ name: 'homeDetail', params: { id: item.id }}">{{ item.title }} <span v-for="tag in item.tags" className="badge">{{ tag }}</span></router-link></li>*/}
                    </ul>
                </div>{/*/.nav-collapse */}
            </div>
        </div>
    </div>
)
