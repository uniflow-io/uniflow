import React, {Component} from 'react'
import debounce from 'lodash/debounce'
import {withRouter} from 'react-router'
import {Folder} from '../../../models'
import {
  updateCurrentFolder,
  deleteCurrentFolder, pathToSlugs
} from '../../../reducers/folder/actions'
import {
  commitSetCurrentFolder, getCurrentPath
} from '../../../reducers/history/actions'
import {connect} from 'react-redux'
import {pathTo} from "../../../routes";
import {Select2Component} from "uniflow/src/components";

const pathToValue = (path) => {
  return `/${path.join('/')}`
}

const valueToPath = (value) => {
  return value.slice(1).split('/')
}

class FolderShow extends Component {
  state = {
    folderTree: []
  }

  componentDidMount() {
    const {folder} = this.props

    this.setState({folderTree: [pathToValue(folder.path)]})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({folderTree: [pathToValue(nextProps.folder.path)]})
  }

  onChangeTitle = (event) => {
    this.props
      .dispatch(commitSetCurrentFolder(new Folder({...this.props.folder, ...{title: event.target.value}})))
      .then(() => {
        this.onUpdate()
      })
  }

  onChangeSlug = (event) => {
    this.props
      .dispatch(commitSetCurrentFolder(new Folder({...this.props.folder, ...{slug: event.target.value}})))
      .then(() => {
        this.onUpdate()
      })
  }

  onChangePath = (selected) => {
    this.props
      .dispatch(commitSetCurrentFolder(new Folder({ ...this.props.folder, ...{ path: valueToPath(selected) } })))
      .then(() => {
        this.onUpdate()
      })
  }

  onUpdate = debounce(() => {
    this.props.dispatch(updateCurrentFolder(this.props.folder, this.props.auth.token))
      .then(() => {
        this.props.history.push(this.itemPathTo(this.props.folder))
      })
  }, 500)

  onDelete = (event) => {
    event.preventDefault()

    let path = getCurrentPath(this.props.historyState).slice(0, -1)

    return this.props.dispatch(deleteCurrentFolder(this.props.folder, this.props.auth.token))
      .then(() => {
        const isCurrentUser = this.props.historyState.username && this.props.historyState.username === this.props.user.username

        let slugs = pathToSlugs(path)

        if (isCurrentUser) {
          this.props.history.push(pathTo('userFlow', Object.assign({username: this.props.historyState.username}, slugs)))
        } else {
          this.props.history.push(pathTo('flow', slugs))
        }
      })
  }

  itemPathTo = (item) => {
    const isCurrentUser = this.props.historyState.username && this.props.historyState.username === this.props.user.username

    let path = item.path.slice()
    path.push(item.slug)
    let slugs = pathToSlugs(path)

    if (isCurrentUser) {
      return pathTo('userFlow', Object.assign({username: this.props.historyState.username}, slugs))
    }

    return pathTo('flow', slugs)
  }

  render() {
    const {folderTree} = this.state
    const {folder} = this.props

    return (
      <div>
        <div className='box box-primary'>
          <div className='box-header with-border'>
            <h3 className='box-title'>Infos</h3>
            <div className='box-tools pull-right'>
              <a className='btn btn-box-tool' onClick={this.onDelete}><i className='fa fa-times'/></a>
            </div>
          </div>
          <div className='box-body'>
            <form className='form-horizontal'>

              <div className='form-group'>
                <label htmlFor='info_title_{{ _uid }}' className='col-sm-2 control-label'>Title</label>

                <div className='col-sm-10'>
                  <input type='text' className='form-control' id='info_title_{{ _uid }}'
                         value={folder.title} onChange={this.onChangeTitle} placeholder='Title'/>
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='info_slug_{{ _uid }}' className='col-sm-2 control-label'>Slug</label>

                <div className='col-sm-10'>
                  <input type='text' className='form-control' id='info_slug_{{ _uid }}'
                         value={folder.slug} onChange={this.onChangeSlug} placeholder='Slug'/>
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='info_path_{{ _uid }}' className='col-sm-2 control-label'>Path</label>

                <div className='col-sm-10'>
                  <Select2Component value={pathToValue(folder.path)} onChange={this.onChangePath} className='form-control' id='info_path_{{ _uid }}' style={{ width: '100%' }}>
                    {folderTree.map((value) => (
                      <option key={value} value={value}>{ value }</option>
                    ))}
                  </Select2Component>
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
    folder: state.history.folder,
    historyState: state.history
  }
})(withRouter(FolderShow))
