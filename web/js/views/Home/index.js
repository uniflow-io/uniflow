import React from 'react'
import History from './History/index'
import Show from './Show/index'

export default () => (
    <div id="home" className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
            <h1>
                Dashboard
                <small>Control panel</small>
            </h1>
            <ol className="breadcrumb">
                <li><a href="#"><i className="fa fa-dashboard" /> Home</a></li>
                <li className="active">Dashboard</li>
            </ol>
        </section>

        {/* Main content */}
        <section className="content">
            <div className="row">
                <div className="col-sm-2">

                    <History />

                </div>
                <div className="col-sm-10">

                    <Show v-if="history" />

                </div>
            </div>
        </section>
        {/* /.content */}
    </div>
)