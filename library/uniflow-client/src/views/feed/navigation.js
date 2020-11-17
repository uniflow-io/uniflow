import React, { Component } from 'react'
import { Link } from 'gatsby'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'
import {
  getOrderedFeed,
  createProgram,
  setCurrentSlug,
  getCurrentPath,
  createFolder,
  feedPathTo,
} from '../../reducers/feed/actions'
import { commitAddLog } from '../../reducers/logs/actions'
import {
  faBars,
  faFolder,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Navigation extends Component {
  state = {
    search: '',
    collapse: true,
  }

  onSearch = event => {
    this.setState({ search: event.target.value })
  }

  onToggle = event => {
    this.setState({ collapse: !this.state.collapse })
  }

  onCreateFolder = event => {
    event.preventDefault()

    this.props
      .dispatch(
        createFolder(
          {
            name: this.state.search,
            path: this.props.feed.folderPath,
          },
          this.props.auth.uid,
          this.props.auth.token
        )
      )
      .then(item => {
        return this.props.dispatch(setCurrentSlug(null)).then(() => {
          navigate(feedPathTo(item, this.props.user))
        })
      })
      .catch(log => {
        return this.props.dispatch(commitAddLog(log.message))
      })
  }

  onSubmit = event => {
    event.preventDefault()

    this.props
      .dispatch(
        createProgram(
          {
            name: this.state.search,
            clients: ['uniflow'],
            tags: [],
            path: this.props.feed.folderPath,
          },
          this.props.auth.uid,
          this.props.auth.token
        )
      )
      .then(item => {
        return this.props
          .dispatch(setCurrentSlug({ type: item.type, id: item.id }))
          .then(() => {
            navigate(feedPathTo(item, this.props.user))
          })
      })
      .catch(log => {
        return this.props.dispatch(commitAddLog(log.message))
      })
  }

  render() {
    const { user } = this.props
    const isCurrentUser = this.props.feed.uid === this.props.auth.uid
    const isFolderActive = () => {
      return this.props.feed.current === null ? 'active' : null
    }
    const isActive = item => {
      return this.props.feed.slug === item.entity.slug ? 'active' : null
    }

    const backTo = () => {
      let path = this.props.feed.folderPath.slice(0, -1)

      return feedPathTo(path, isCurrentUser ? this.props.feed.uid : null)
    }

    const folderTo = () => {
      let path = this.props.feed.folderPath

      return feedPathTo(path, isCurrentUser ? this.props.feed.uid : null)
    }

    return (
      <div className="sidebar">
        <form
          className="sidebar-search d-flex align-items-center"
          role="search"
          onSubmit={this.onSubmit}
        >
          <div className="input-group">
            <input
              type="search"
              className="form-control ds-input"
              placeholder="Search..."
              aria-label="Search for..."
              value={this.state.search}
              onChange={this.onSearch}
            />
            {this.state.search && (
              <div className="input-group-append">
                <button
                  className="input-group-text"
                  type="button"
                  onClick={this.onCreateFolder}
                >
                  <FontAwesomeIcon icon={faFolder} />
                </button>
              </div>
            )}
          </div>
          <button
            className="btn d-sm-none p-0 ml-3 collapsed"
            type="button"
            onClick={this.onToggle}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </form>
        <nav
          className={`sidebar-nav${
            this.state.collapse ? ' d-none d-sm-block' : ''
          }`}
        >
          <div className="sidebar-section">
            <ul className="sidebar-items">
              {this.props.feed.folder && [
                <li key={'back'}>
                  <span className="link">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                  </span>
                  <Link to={backTo()}>Back</Link>
                </li>,
                <li className={isFolderActive()} key={'folder'}>
                  <span className="link">.</span>
                  <Link to={folderTo()}>.</Link>
                </li>,
              ]}
              {getOrderedFeed(this.props.feed, this.state.search).map(
                (item, i) => (
                  <li className={isActive(item)} key={i}>
                    <span className="link">
                      {item.type === 'folder' && (
                        <>
                          <FontAwesomeIcon icon={faFolder} /> {item.entity.name}{' '}
                        </>
                      )}
                      {item.type === 'program' && (<>{item.entity.name} </>)}
                      {item.type === 'program' &&
                        item.entity.tags.map((tag, j) => (
                          <span key={j} className="badge badge-light mr-1">
                            {tag}
                          </span>
                        ))}
                    </span>
                    <Link to={feedPathTo(item.entity, user)}>{item.entity.name}</Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  user: state.user,
  feed: state.feed,
}))(Navigation)
