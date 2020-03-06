import React, { Component } from 'react'
import { Link } from 'gatsby'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'
import {
  getOrderedFeed,
  createProgram,
  setCurrentFeed,
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
            path: getCurrentPath(this.props.feed),
          },
          this.props.auth.token
        )
      )
      .then(item => {
        return this.props.dispatch(setCurrentFeed(null)).then(() => {
          navigate(this.itemPathTo(item))
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
            path: getCurrentPath(this.props.feed),
          },
          this.props.auth.token
        )
      )
      .then(item => {
        return this.props
          .dispatch(setCurrentFeed({ type: item.type, id: item.id }))
          .then(() => {
            navigate(this.itemPathTo(item))
          })
      })
      .catch(log => {
        return this.props.dispatch(commitAddLog(log.message))
      })
  }

  itemPathTo = item => {
    const isCurrentUser =
      this.props.feed.username &&
      this.props.feed.username === this.props.user.username

    let path = item.path.slice()
    path.push(item.slug)

    return feedPathTo(
      path,
      item.public || isCurrentUser ? this.props.feed.username : null
    )
  }

  render() {
    const isCurrentUser =
      this.props.feed.username &&
      this.props.feed.username === this.props.user.username
    const isFolderActive = () => {
      return this.props.feed.current === null ? 'active' : null
    }
    const isActive = item => {
      return this.props.feed.current &&
        this.props.feed.current.type === item.type &&
        this.props.feed.current.id === item.id
        ? 'active'
        : null
    }

    const backTo = () => {
      let path = getCurrentPath(this.props.feed).slice(0, -1)

      return feedPathTo(path, isCurrentUser ? this.props.feed.username : null)
    }

    const folderTo = () => {
      let path = getCurrentPath(this.props.feed)

      return feedPathTo(path, isCurrentUser ? this.props.feed.username : null)
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
                          <FontAwesomeIcon icon={faFolder} /> {item.name}{' '}
                        </>
                      )}
                      {item.type === 'program' && (<>{item.name} </>)}
                      {item.type === 'program' &&
                        item.tags.map((tag, j) => (
                          <span key={j} className="badge badge-secondary mr-1">
                            {tag}
                          </span>
                        ))}
                    </span>
                    <Link to={this.itemPathTo(item)}>{item.name}</Link>
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
