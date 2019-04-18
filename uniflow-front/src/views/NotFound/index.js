import React, { Component } from 'react'
import { pathTo } from '../../routes'
import { Link } from 'gatsby'

export default class NotFound extends Component {
  render() {
    return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            404
            <small>Control panel</small>
          </h1>
          <ol className="breadcrumb">
            <li>
              <Link to={pathTo('home')}>
                <i className="fa fa-dashboard" /> Home
              </Link>
            </li>
            <li className="active">404</li>
          </ol>
        </section>
      </div>
    )
  }
}
