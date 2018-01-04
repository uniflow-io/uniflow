import React from 'react'

export default () => (
    <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
            <h1>
                Logs
                <small>Control panel</small>
            </h1>
            <ol className="breadcrumb">
                <li><a href="#"><i className="fa fa-dashboard" /> Home</a></li>
                <li className="active">Logs</li>
            </ol>
        </section>

        {/* Main content */}
        <section className="content">
            <div className="row">
                <div className="col-md-12">

                    <h3>Logs</h3>
                    <ul>
                        <li>04/01/2018 - <span className="fa fa-tag">0.10</span> Display uniflow logs</li>
                        <li>04/01/2018 - <span className="fa fa-tag">0.09</span> Migrate from VueJS to ReactJS</li>
                        <li>08/12/2017 - <span className="fa fa-tag">0.08</span> Implement multi-user connection</li>
                        <li>22/11/2016 - <span className="fa fa-tag">0.07</span> Display active block when running a flow</li>
                        <li>18/11/2016 - <span className="fa fa-tag">0.06</span> Uniflow flow implementation</li>
                        <li>15/11/2016 - <span className="fa fa-tag">0.05</span> Uniflow core components</li>
                        <li>19/10/2016 - <span className="fa fa-tag">0.04</span> Interface with VueJS 2.0</li>
                        <li>27/11/2013 - <span className="fa fa-tag">0.03</span> Use NoFlo</li>
                        <li>15/11/2013 - <span className="fa fa-tag">0.02</span> Graph update</li>
                        <li>04/09/2013 - <span className="fa fa-tag">0.01</span> Bootstrap 3</li>
                    </ul>

                </div>
            </div>
        </section>
        {/* /.content */}
    </div>

)
