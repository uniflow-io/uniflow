import React, {Component} from 'react'
import {pathTo} from '../routes'
import {Link} from 'gatsby'
import Layout from "../layouts";

export default class FAQ extends Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <div className='content-wrapper'>
          <section className='content-header'>
            <h1>
              FAQ
              <small>Control panel</small>
            </h1>
            <ol className='breadcrumb'>
              <li><Link to={pathTo('home')}><i className='fa fa-dashboard'/> Home</Link></li>
              <li className='active'>FAQ</li>
            </ol>
          </section>

          <section className='content'>
            <div className='row'>
              <div className='col-md-12'>

                <h3>Why ?</h3>
                <p>Workflow your microtasks</p>

                <h3>How ?</h3>
                <p>Think macro, act micro</p>

                <h3>Mono Flow, the inspiration</h3>
                <p>
                  I did realy like, and a very fan of NoFlow or Workflow for iOS, IFTTT, Automator, Zapier,
                  Huggin, google
                  Blocky.
                  The flow programming is very interresting, because you assemble blocs like legos.
                  What can become complicated is when you assemble too much and you got a graph like spagety.
                  So i did make a choice to make it human readable and have your flow ordered by a single
                  list, as human we
                  like list it's common, anchor into our usage, affordable and natural to read from top to
                  bottom.
                  At the end you can make anything into each blocks, so have conditions, loops and so on as
                  long as something
                  is delivered at the end.
                  For the interface, i also did pickup the philopsophy of nvALT
                </p>

                <h3>What content it deserve</h3>
                <p>
                  The goal is to deserve realy anything. So a block can be a simple text transformation as it
                  can be a very
                  specific process.
                  The harmony is important for having a base to allow mix blocks together.
                  Only the security is the top most priority to be checked.
                </p>

              </div>
            </div>
          </section>
        </div>
      </Layout>
    )
  }
}
