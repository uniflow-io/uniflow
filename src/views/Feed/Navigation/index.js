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
  feedPathTo
} from '../../../reducers/feed/actions'
import { commitAddLog } from '../../../reducers/logs/actions'

class Navigation extends Component {
  state = {
    search: '',
  }

  onChange = event => {
    this.setState({ search: event.target.value })
  }

  onCreateFolder = event => {
    event.preventDefault()

    this.props
      .dispatch(
        createFolder(
          {
            title: this.state.search,
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
            title: this.state.search,
            client: 'uniflow',
            tags: [],
            description: '',
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

  render () {
    const isCurrentUser =
      this.props.feed.username &&
      this.props.feed.username === this.props.user.username
    const isFolderActive = () => {
      return this.props.feed.current === null ? 'active' : ''
    }
    const isActive = item => {
      return this.props.feed.current &&
        this.props.feed.current.type === item.type &&
        this.props.feed.current.id === item.id
        ? 'active'
        : ''
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
      <div className="box box-danger">
        <div className="box-body">
          <div
            className="navbar navbar-default navbar-vertical"
            role="navigation"
          >
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle"
                data-toggle="collapse"
                data-target=".sidebar-navbar-collapse"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <span className="visible-xs navbar-brand">Sidebar menu</span>
            </div>
            <div className="navbar-collapse collapse sidebar-navbar-collapse show">
              <ul className="nav navbar-nav">
                <li>
                  <form
                    className="navbar-form"
                    role="search"
                    onSubmit={this.onSubmit}
                  >
                    <div className="input-group" style={{ width: '100%' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={this.state.search}
                        onChange={this.onChange}
                      />
                      {this.state.search && (
                        <span className="input-group-btn">
                          <button
                            className="btn btn-default"
                            type="button"
                            onClick={this.onCreateFolder}
                          >
                            <i className="fa fa-folder" />
                          </button>
                        </span>
                      )}
                    </div>
                  </form>
                </li>
                {this.props.feed.folder && [
                  <li key={'back'}>
                    <Link to={backTo()}>
                      <i className="fa fa-arrow-left fa-fw" /> Back
                    </Link>
                  </li>,
                  <li className={isFolderActive()} key={'folder'}>
                    <Link to={folderTo()}>.</Link>
                  </li>,
                ]}
                {getOrderedFeed(this.props.feed, this.state.search).map(
                  (item, i) => (
                    <li className={isActive(item)} key={i}>
                      <Link to={this.itemPathTo(item)}>
                        {item.type === 'folder' && (
                          <i className="fa fa-folder fa-fw" />
                        )}
                        {item.title}{' '}
                        {item.type === 'program' &&
                          item.tags.map((tag, j) => (
                            <span key={j} className="badge">
                              {tag}
                            </span>
                          ))}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  user: state.user,
  feed: state.feed,
}))(Navigation)
