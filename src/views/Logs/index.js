import React from 'react'

const logs = [{
    tag: '0.25',
    label: 'Add authentification by JWT tokens',
    date: '20/09/2018'
}, {
    tag: '0.24',
    label: 'Add chrome platform',
    date: '30/08/2018'
}, {
    tag: '0.23',
    label: 'Add platform to history',
    date: '30/08/2018'
}, {
    tag: '0.22',
    label: 'Add regex component',
    date: '17/08/2018'
}, {
    tag: '0.21',
    label: 'Add prompt component',
    date: '05/08/2018'
}, {
    tag: '0.20',
    label: 'Add bash runner',
    date: '26/07/2018'
}, {
    tag: '0.19',
    label: 'Add webpack tool for development',
    date: '12/07/2018'
}, {
    tag: '0.18',
    label: 'Symfony 4',
    date: '04/07/2018'
}, {
    tag: '0.17',
    label: 'Add browser component',
    date: '21/06/2018'
}, {
    tag: '0.16',
    label: 'Add while component',
    date: '17/04/2018'
}, {
    tag: '0.15',
    label: 'Add if component',
    date: '17/04/2018'
}, {
    tag: '0.14',
    label: 'Add yaml component',
    date: '12/04/2018'
}, {
    tag: '0.13',
    label: 'Refactor components with tagging',
    date: '21/03/2018'
}, {
    tag: '0.12',
    label: 'Core include',
    date: '15/01/2018'
}, {
    tag: '0.11',
    label: 'Demo account reset',
    date: '15/01/2018'
}, {
    tag: '0.10',
    label: 'Display uniflow',
    date: '04/01/2018'
},{
    tag: '0.09',
    label: 'Migrate from VueJS',
    date: '04/01/2018'
},{
    tag: '0.08',
    label: 'Implement multi-user connection',
    date: '08/12/2017'
},{
    tag: '0.07',
    label: 'Display active block when running a flow',
    date: '22/11/2016'
},{
    tag: '0.06',
    label: 'Uniflow flow implementation',
    date: '18/11/2016'
},{
    tag: '0.05',
    label: 'Uniflow core components',
    date: '15/11/2016'
},{
    tag: '0.04',
    label: 'Interface with VueJS 2.0',
    date: '19/10/2016'
},{
    tag: '0.03',
    label: 'Use NoFlo',
    date: '27/11/2013'
},{
    tag: '0.02',
    label: 'Graph update',
    date: '15/11/2013'
},{
    tag: '0.01',
    label: 'Bootstrap 3',
    date: '04/09/2013'
}]

export default () => (
    <div className="content-wrapper">
        <section className="content-header">
            <h1>
                Logs
                <small>Control panel</small>
            </h1>
            <ol className="breadcrumb">
                <li><a href="#"><i className="fa fa-dashboard"/> Home</a></li>
                <li className="active">Logs</li>
            </ol>
        </section>

        {/* Main content */}
        <section className="content">
            <div className="row">
                <div className="col-md-12">

                    <h3>Logs</h3>

                    <ul className="timeline">
                        {logs.map((value, index) => ([
                            <li key={'date-'+index} className="time-label"><span className="bg-green">{value.date}</span></li>,
                            <li key={'label-'+index}>
                                <div className="timeline-item">
                                    <h3 className="timeline-header">{value.label}</h3>
                                    <div className="timeline-body" />
                                    <div className="timeline-footer">
                                        <span className="label label-primary fa fa-tag"> {value.tag}</span>
                                    </div>
                                </div>
                            </li>
                        ]))}
                    </ul>

                </div>
            </div>
        </section>
        {/* /.content */}
    </div>
)
