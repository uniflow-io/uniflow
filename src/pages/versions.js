import React, {Component} from 'react'
import {pathTo} from '../routes'
import {Link} from 'gatsby'
import connect from 'react-redux/es/connect/connect'
import Layout from "../layouts";

class Versions extends Component {
  render() {
    const {versions} = this.props

    return (
      <Layout location={this.props.location}>
        <div className='content-wrapper'>
          <section className='content-header'>
            <h1>
              Versions
              <small>Control panel</small>
            </h1>
            <ol className='breadcrumb'>
              <li><Link to={pathTo('home')}><i className='fa fa-dashboard'/> Home</Link></li>
              <li className='active'>Versions</li>
            </ol>
          </section>

          <section className='content'>
            <div className='row'>
              <div className='col-md-12'>

                <h3>Versions</h3>

                <ul className='timeline'>
                  {versions.map((value, index) => ([
                    <li key={'date-' + index} className='time-label'><span
                      className='bg-green'>{value.date}</span></li>,
                    <li key={'label-' + index}>
                      <div className='timeline-item'>
                        <h3 className='timeline-header'>{value.label}</h3>
                        <div className='timeline-body'/>
                        <div className='timeline-footer'>
                          <span className='label label-primary fa fa-tag'> {value.tag}</span>
                        </div>
                      </div>
                    </li>
                  ]))}
                </ul>

              </div>
            </div>
          </section>
        </div>
      </Layout>
    )
  }
}

export default connect(state => {
  return {
    versions: state.versions
  }
})(Versions)
