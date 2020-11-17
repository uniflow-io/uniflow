import React, { Component } from 'react'
import { navigate } from 'gatsby'
import debounce from 'lodash/debounce'
import { connect } from 'react-redux'
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  getFolderTree,
  updateCurrentFolder,
  deleteCurrentFolder,
  pathsToPath,
  pathToPaths,
  commitSetCurrentFolderPath,
  getCurrentPath,
  feedPathTo,
} from '../../reducers/feed/actions'
import { Select } from '../../components'

class Folder extends Component {
  state = {
    folderTreeEdit: false,
    folderTree: [],
  }

  componentDidMount() {
    const { folder } = this.props

    this.setState({ folderTree: [folder.path] })
  }

  componentDidUpdate(prevProps) {
    if (this.props.folder.id !== prevProps.folder.id) {
      this.setState({
        folderTreeEdit: false,
        folderTree: [this.props.folder.path],
      })
    }
  }

  onChangeTitle = event => {
    this.props
      .dispatch(
        commitSetCurrentFolderPath({
          ...this.props.folder,
          ...{ name: event.target.value },
        })
      )
      .then(() => {
        this.onUpdate()
      })
  }

  onChangeSlug = event => {
    this.props
      .dispatch(
        commitSetCurrentFolderPath({
          ...this.props.folder,
          ...{ slug: event.target.value },
        })
      )
      .then(() => {
        this.onUpdate()
      })
  }

  onChangePath = selected => {
    this.props
      .dispatch(
        commitSetCurrentFolderPath({
          ...this.props.folder,
          ...{ path: pathToPaths(selected) },
        })
      )
      .then(() => {
        this.onUpdate()
      })
  }

  onUpdate = debounce(() => {
    this.props
      .dispatch(updateCurrentFolder(this.props.folder, this.props.auth.token))
      .then(() => {
        const path = feedPathTo(this.props.folder, this.props.user)
        if (typeof window !== `undefined` && window.location.pathname !== path) {
          navigate(path)
        }
      })
  }, 500)

  onDelete = event => {
    event.preventDefault()

    let path = this.props.feed.folderPath.slice(0, -1)

    return this.props
      .dispatch(deleteCurrentFolder(this.props.folder, this.props.auth.token))
      .then(() => {
        const isCurrentUser =
          this.props.feed.uid &&
          this.props.feed.uid === this.props.user.uid

        navigate(
          feedPathTo(path, isCurrentUser ? this.props.feed.uid : null)
        )
      })
  }

  onFolderEdit = event => {
    event.preventDefault()

    const { feed, folder } = this.props

    this.props
      .dispatch(getFolderTree(feed.uid, this.props.auth.token))
      .then(folderTree => {
        let folderPath = folder.path.slice()
        folderPath.push(folder.slug)
        folderPath = pathsToPath(folderPath)

        folderTree = folderTree.map(path => {
          return pathsToPath(path)
        })
        folderTree = folderTree.filter(value => {
          return value.startsWith(folderPath) === false
        })

        this.setState({
          folderTreeEdit: true,
          folderTree: folderTree,
        })
      })
  }

  render() {
    const { folderTreeEdit, folderTree } = this.state
    const { folder } = this.props

    return (
      <section className="section col">
        <div className="row">
          <div className="col">
            <h3>Infos</h3>
          </div>
          <div className="d-block col-auto">
            <div
              className="btn-toolbar"
              role="toolbar"
              aria-label="folder actions"
            >
              <div className="btn-group-sm" role="group">
                <button type="button" className="btn" onClick={this.onDelete}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <form className="form-sm-horizontal">
          <div className="form-group row">
            <label
              htmlFor="info_name_{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Title
            </label>

            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="info_name_{{ _uid }}"
                value={folder.name}
                onChange={this.onChangeTitle}
                placeholder="Title"
              />
            </div>
          </div>

          <div className="form-group row">
            <label
              htmlFor="info_slug_{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Slug
            </label>

            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="info_slug_{{ _uid }}"
                value={folder.slug}
                onChange={this.onChangeSlug}
                placeholder="Slug"
              />
            </div>
          </div>

          <div className="form-group row">
            <label
              htmlFor="info_path_{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Path
            </label>

            <div className="col-sm-10">
              {(folderTreeEdit && (
                <Select
                  value={folder.path}
                  onChange={this.onChangePath}
                  className="form-control"
                  id="info_path_{{ _uid }}"
                  options={folderTree.map(value => {
                    return { value: value, label: value }
                  })}
                />
              )) || (
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={this.onFolderEdit}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>{' '}
                  {folder.path}
                </div>
              )}
            </div>
          </div>
        </form>
      </section>
    )
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    user: state.user,
    feed: state.feed,
  }
})(Folder)
