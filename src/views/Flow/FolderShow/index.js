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

    onDuplicate = (event) => {
      event.preventDefault()

      let history = new History(this.props.history)
      history.title += ' Copy'

      this.props.dispatch(createHistory(history, this.props.auth.token))
        .then((item) => {
          Object.assign(history, item)
          return this.props.dispatch(setHistoryData(history, this.props.auth.token))
        })
        .then(() => {
          return this.props.dispatch(setCurrentHistory({type: history.constructor.name, id: history.id}))
        })
        .catch((log) => {
          return this.props.dispatch(commitAddLog(log.message))
        })
    }

    onDelete = (event) => {
      event.preventDefault()

      return this.props.dispatch(deleteHistory(this.props.history, this.props.auth.token))
    }

    getComponents = (userComponents, history) => {
      let componentLabels = []

      for (let i = 0; i < userComponents.length; i++) {
        let key = userComponents[i]

        if (components[key].clients().indexOf(history.client) !== -1) {
          componentLabels.push({
            key: key,
            label: components[key].tags().join(' - ') + ' : ' + key
          })
        }
      }

      componentLabels.sort(function (component1, component2) {
        let x = component1.label
        let y = component2.label
        return x < y ? -1 : x > y ? 1 : 0
      })

      return componentLabels
    }

    render () {
      const { history, tags, stack, client, user } = this.props
      const tagsOptions = {
        availableTags: tags
      }
      const components = this.getComponents(user.components, history)
      const clients = {
        'uniflow': 'Uniflow',
        'bash': 'Bash',
        'phpstorm': 'PhpStorm',
        'chrome': 'Chrome'
      }

      return (
        <div>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <h3 className='box-title'>Infos</h3>
              <div className='box-tools pull-right'>
                <a className='btn btn-box-tool' onClick={this.onDuplicate}><i className='fa fa-clone' /></a>
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

                <div className='form-group'>
                  <label htmlFor='info_client_{{ _uid }}' className='col-sm-2 control-label'>Client</label>

                  <div className='col-sm-10'>
                    <Select2Component value={history.client} onChange={this.onChangeClient} className='form-control' id='info_client_{{ _uid }}' style={{ width: '100%' }}>
                      {Object.keys(clients).map((value) => (
                        <option key={value} value={value}>{ clients[value] }</option>
                      ))}
                    </Select2Component>
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='info_tags_{{ _uid }}' className='col-sm-2 control-label'>Tags</label>

                  <div className='col-sm-10'>
                    <TagItComponent type='text' className='form-control' id='info_tags_{{ _uid }}'
                      value={history.tags} onChange={this.onChangeTags} options={tagsOptions}
                      placeholder='Tags' />
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='public{{ _uid }}' className='col-sm-2 control-label'>Public</label>

                  <div className='col-sm-10'>
                    <ICheckBoxComponent value={history.public} onChange={this.onChangePublic} />
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='info_description_{{ _uid }}'
                    className='col-sm-2 control-label'>Description</label>

                  <div className='col-sm-10'>
                    <AceComponent className='form-control' id='info_description_{{ _uid }}'
                      value={history.description} onChange={this.onChangeDescription}
                      placeholder='Text' height='200' />
                  </div>
                </div>

              </form>
            </div>
            <div className='box-footer'>
              {history.client === 'uniflow' && (
                <a className='btn btn-success' onClick={this.run}><i className='fa fa-fw fa-play' /> Play</a>
              )}
            </div>
          </div>

          <ListComponent stack={stack} runIndex={this.state.runIndex}
            components={components}
            onPush={this.onPushFlow}
            onPop={this.onPopFlow}
            onUpdate={this.onUpdateFlow}
            onRun={this.run}
          />
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
