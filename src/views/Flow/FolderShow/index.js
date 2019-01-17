import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import {withRouter} from 'react-router'
import { Folder } from '../../../models'
import {
  updateCurrentFolder,
  deleteCurrentFolder
} from '../../../reducers/folder/actions'
import {
  commitSetCurrentFolder
} from '../../../reducers/history/actions'
import { connect } from 'react-redux'

class FolderShow extends Component {
    onChangeTitle = (event) => {
      this.props
        .dispatch(commitSetCurrentFolder(new Folder({ ...this.props.folder, ...{ title: event.target.value } })))
        .then(() => {
          this.onUpdate()
        })
    }

    onChangeSlug = (event) => {
      this.props
        .dispatch(commitSetCurrentFolder(new Folder({ ...this.props.folder, ...{ slug: event.target.value } })))
        .then(() => {
          this.onUpdate()
        })
    }

    onUpdate = debounce(() => {
      this.props.dispatch(updateCurrentFolder(this.props.folder, this.props.auth.token))
    }, 500)

    onDelete = (event) => {
      event.preventDefault()

      return this.props.dispatch(deleteCurrentFolder(this.props.folder, this.props.auth.token))
    }

    render () {
      const { folder } = this.props

      return (
        <div>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <h3 className='box-title'>Infos</h3>
              <div className='box-tools pull-right'>
                <a className='btn btn-box-tool' onClick={this.onDelete}><i className='fa fa-times' /></a>
              </div>
            </div>
            <div className='box-body'>
              <form className='form-horizontal'>

                <div className='form-group'>
                  <label htmlFor='info_title_{{ _uid }}' className='col-sm-2 control-label'>Title</label>

                  <div className='col-sm-10'>
                    <input type='text' className='form-control' id='info_title_{{ _uid }}'
                      value={folder.title} onChange={this.onChangeTitle} placeholder='Title' />
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='info_slug_{{ _uid }}' className='col-sm-2 control-label'>Slug</label>

                  <div className='col-sm-10'>
                    <input type='text' className='form-control' id='info_slug_{{ _uid }}'
                      value={folder.slug} onChange={this.onChangeSlug} placeholder='Slug' />
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
    folder: state.history.folder,
  }
})(withRouter(FolderShow))
