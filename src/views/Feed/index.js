import React, {Component} from 'react'
import Navigation from './Navigation'
import ProgramShow from './ProgramShow'
import FolderShow from './FolderShow'
import {getCurrentProgram} from '../../reducers/feed/actions'
import {connect} from 'react-redux'
import {pathTo} from '../../routes'
import {Link} from 'gatsby'

class Feed extends Component {
  render() {
    const {feed}         = this.props
    const currentProgram = getCurrentProgram(feed)

    return (
      <div id='feed' className='content-wrapper'>
        <section className='content-header'>
          <h1>
            Dashboard
            <small>Control panel</small>
          </h1>
          <ol className='breadcrumb'>
            <li><Link to={pathTo('home')}><i className='fa fa-dashboard'/> Home</Link></li>
            <li className='active'>Feed</li>
          </ol>
        </section>

        <section className='content'>
          <div className='row'>
            <div className='col-sm-2'>
              <Navigation/>
            </div>
            <div className='col-sm-10'>
              {feed.username && currentProgram && currentProgram.constructor.name === 'Program' && (
                <ProgramShow/>
              )}
              {feed.username && currentProgram === null && feed.folder && (
                <FolderShow/>
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
    feed: state.feed
  }
})(Feed)
