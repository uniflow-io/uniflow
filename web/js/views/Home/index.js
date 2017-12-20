import React from 'react'

export default () => (
    <div id="home" className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
            <h1>
                Dashboard
                <small>Control panel</small>
            </h1>
            <ol className="breadcrumb">
                <li><a href="#"><i className="fa fa-dashboard"></i> Home</a></li>
                <li className="active">Dashboard</li>
            </ol>
        </section>

        {/* Main content */}
        <section className="content">
            <div className="row">
                <div className="col-md-2">

                    <history />

                </div>
                <div className="col-md-10">

                    <show v-if="history" />

                </div>
            </div>
        </section>
        {/* /.content */}
    </div>
)
