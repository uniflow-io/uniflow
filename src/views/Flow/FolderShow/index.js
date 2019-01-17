import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import { AceComponent, ListComponent, TagItComponent, ICheckBoxComponent, Select2Component } from 'uniflow/src/components'
import { Folder } from '../../../models'
import {
  getCurrentHistory,
  getTags,
  commitUpdateHistory,
  createHistory,
  updateHistory,
  deleteHistory,
  getHistoryData,
  setHistoryData,
  setCurrentHistory
} from '../../../reducers/folder/actions'
import { commitAddLog } from '../../../reducers/logs/actions'
import { connect } from 'react-redux'
import components from '../../../uniflow'

class FolderShow extends Component {
    onChangeTitle = (event) => {
      this.props
        .dispatch(commitUpdateHistory(new History({ ...this.props.history, ...{ title: event.target.value } })))
        .then(() => {
          this.onUpdate()
        })
    }

    onChangeSlug = (event) => {
      this.props
        .dispatch(commitUpdateHistory(new History({ ...this.props.history, ...{ slug: event.target.value } })))
        .then(() => {
          this.onUpdate()
        })
    }

    onUpdate = debounce(() => {
      this.props.dispatch(updateHistory(this.props.history, this.props.auth.token))
    }, 500)

    onDelete = (event) => {
      event.preventDefault()

      return this.props.dispatch(deleteHistory(this.props.history, this.props.auth.token))
    }

    render () {
      const { history, tags, stack, client, user } = this.props
      const tagsOptions = {
        availableTags: tags
      }

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
                      value={history.title} onChange={this.onChangeTitle} placeholder='Title' />
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='info_slug_{{ _uid }}' className='col-sm-2 control-label'>Slug</label>

                  <div className='col-sm-10'>
                    <input type='text' className='form-control' id='info_slug_{{ _uid }}'
                      value={history.slug} onChange={this.onChangeSlug} placeholder='Slug' />
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
    history: getCurrentHistory(state.history),
    tags: getTags(state.history),
    username: state.history.username,
    stack: state.flow
  }
})(FolderShow)
