import React, { Component } from 'react'
import History from './History'
import Show from './Show'
import FolderShow from './FolderShow'
import { getCurrentHistory } from '../../reducers/history/actions'
import { connect } from 'react-redux'
import { pathTo } from '../../routes'
import { Link } from 'react-router-dom'

class Flow extends Component<Props> {
  render () {
    const { history } = this.props
    const currentHistory = getCurrentHistory(history)

    return (
      <div id='flow' className='content-wrapper'>
        <section className='content-header'>
          <h1>
                        Dashboard
            <small>Control panel</small>
          </h1>
          <ol className='breadcrumb'>
            <li><Link to={pathTo('home')}><i className='fa fa-dashboard' /> Home</Link></li>
            <li className='active'>Flow</li>
          </ol>
        </section>

        <section className='content'>
          <div className='row'>
            <div className='col-sm-2'>
              <History />
            </div>
            <div className='col-sm-10'>
              {history.username && currentHistory && currentHistory.constructor.name === 'History' && (
                <Show />
              )}
              {history.username && currentHistory === null && history.folder !== null && (
                /*<FolderShow />*/<div />
              )}
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default connect(state => {
  return {
    history: state.history
  }
})(Flow)
