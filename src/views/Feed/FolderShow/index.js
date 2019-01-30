import React, { Component } from 'react'
import { navigate } from 'gatsby'
import debounce from 'lodash/debounce'
import { Folder } from '../../../models'
import {
  getFolderTree,
  updateCurrentFolder,
  deleteCurrentFolder,
  pathToString,
  stringToPath,
  commitSetCurrentFolder,
  getCurrentPath,
  feedPathTo
} from '../../../reducers/feed/actions'
import { connect } from 'react-redux'
import { Select2Component } from 'uniflow/src/components'

class FolderShow extends Component {
  state = {
    folderTreeEdit: false,
    folderTree: [],
  }

  componentDidMount () {
    const { folder } = this.props

    this.setState({ folderTree: [pathToString(folder.path)] })
  }

  componentWillReceiveProps (nextProps) {
    const oldProps = this.props

    if (nextProps.folder.id !== oldProps.folder.id) {
      this.setState({
        folderTreeEdit: false,
        folderTree: [pathToString(nextProps.folder.path)],
      })
    }
  }

  onChangeTitle = event => {
    this.props
      .dispatch(
        commitSetCurrentFolder({
          ...this.props.folder,
          ...{ title: event.target.value },
        })
      )
      .then(() => {
        this.onUpdate()
      })
  }

  onChangeSlug = event => {
    this.props
      .dispatch(
        commitSetCurrentFolder({
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
        commitSetCurrentFolder({
          ...this.props.folder,
          ...{ path: stringToPath(selected) },
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
        navigate(this.itemPathTo(this.props.folder))
      })
  }, 500)

  onDelete = event => {
    event.preventDefault()

    let path = getCurrentPath(this.props.feed).slice(0, -1)

    return this.props
      .dispatch(deleteCurrentFolder(this.props.folder, this.props.auth.token))
      .then(() => {
        const isCurrentUser =
          this.props.feed.username &&
          this.props.feed.username === this.props.user.username

        navigate(
          feedPathTo(path, isCurrentUser ? this.props.feed.username : null)
        )
      })
  }

  onFolderEdit = event => {
    event.preventDefault()

    const { feed, folder } = this.props

    this.props
      .dispatch(getFolderTree(feed.username, this.props.auth.token))
      .then(folderTree => {
        let folderPath = folder.path.slice()
        folderPath.push(folder.slug)
        folderPath = pathToString(folderPath)

        folderTree = folderTree.map(path => {
          return pathToString(path)
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

  itemPathTo = item => {
    const isCurrentUser =
      this.props.feed.username &&
      this.props.feed.username === this.props.user.username

    let path = item.path.slice()
    path.push(item.slug)

    return feedPathTo(path, isCurrentUser ? this.props.feed.username : null)
  }

  render () {
    const { folderTreeEdit, folderTree } = this.state
    const { folder } = this.props

    return (
      <div>
        <div className="box box-primary">
          <div className="box-header with-border">
            <h3 className="box-title">Infos</h3>
            <div className="box-tools pull-right">
              <a className="btn btn-box-tool" onClick={this.onDelete}>
                <i className="fa fa-times" />
              </a>
            </div>
          </div>
          <div className="box-body">
            <form className="form-horizontal">
              <div className="form-group">
                <label
                  htmlFor="info_title_{{ _uid }}"
                  className="col-sm-2 control-label"
                >
                  Title
                </label>

                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="info_title_{{ _uid }}"
                    value={folder.title}
                    onChange={this.onChangeTitle}
                    placeholder="Title"
                  />
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor="info_slug_{{ _uid }}"
                  className="col-sm-2 control-label"
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

              <div className="form-group">
                <label
                  htmlFor="info_path_{{ _uid }}"
                  className="col-sm-2 control-label"
                >
                  Path
                </label>

                <div className="col-sm-10">
                  {(folderTreeEdit && (
                    <Select2Component
                      value={pathToString(folder.path)}
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
                        className="btn btn-primary"
                        onClick={this.onFolderEdit}
                      >
                        <i className="fa fa-edit fa-fw" />
                      </button>
                      {pathToString(folder.path)}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    user: state.user,
    folder: state.feed.folder,
    feed: state.feed,
  }
})(FolderShow)
