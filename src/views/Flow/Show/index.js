import React, {Component} from 'react'
import {withRouter} from 'react-router'
import debounce from 'lodash/debounce'
import {AceComponent, ListComponent, TagItComponent, ICheckBoxComponent, Select2Component} from 'uniflow/src/components'
import {Folder, History, Runner} from '../../../models'
import {
  commitPushFlow,
  commitPopFlow,
  commitUpdateFlow,
  commitSetFlow
} from 'uniflow/src/reducers/flow/actions'
import {
  getCurrentHistory,
  getTags,
  commitUpdateHistory,
  createHistory,
  updateHistory,
  deleteHistory,
  getHistoryData,
  setHistoryData,
  setCurrentHistory, commitSetCurrentFolder
} from '../../../reducers/history/actions'
import {commitAddLog} from '../../../reducers/logs/actions'
import {connect} from 'react-redux'
import components from '../../../uniflow'
import {getFolderTree, pathToSlugs, pathToString, stringToPath} from "../../../reducers/folder/actions";
import {pathTo} from "../../../routes";

class Show extends Component {
  state = {
    fetchedSlug: null,
    fetchedUsername: null,
    runIndex: null,
    folderTreeEdit: false,
    folderTree: []
  }

  componentDidMount() {
    const {historyObj} = this.props

    this._isMounted = true

    this.setState({folderTree: [pathToString(historyObj.path)]})

    this.onFetchFlowData()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentWillReceiveProps(nextProps) {
    const oldProps = this.props

    if (nextProps.historyObj.id !== oldProps.historyObj.id) {
      this.setState({
        folderTreeEdit: false,
        folderTree: [pathToString(nextProps.historyObj.path)]
      })

      this.onFetchFlowData()
    }
  }

  isMounted() {
    return this._isMounted
  }

  run = (event, index) => {
    event.preventDefault()

    let stack = index === undefined ? this.props.stack : this.props.stack.slice(0, index + 1)

    let runner = new Runner()

    runner.run(stack, (index) => {
      return new Promise((resolve) => {
        this.setState({runIndex: index}, resolve)
      })
    })
  }

  setFlow = (stack) => {
    return this.props
      .dispatch(commitSetFlow(stack))
      .then(() => {
        return Promise.all(stack.map((item) => {
          return item.bus.emit('reset', item.data)
        }))
      })
  }

  onPushFlow = (index, component) => {
    this.props
      .dispatch(commitPushFlow(index, component))
      .then(() => {
        return this.setFlow(this.props.stack)
      }).then(() => {
      this.onUpdateFlowData()
    })
  }

  onPopFlow = (index) => {
    this.props
      .dispatch(commitPopFlow(index))
      .then(() => {
        return this.setFlow(this.props.stack)
      }).then(() => {
      this.onUpdateFlowData()
    })
  }

  onUpdateFlow = (index, data) => {
    this.props
      .dispatch(commitUpdateFlow(index, data))
      .then(() => {
        this.onUpdateFlowData()
      })
  }

  onFetchFlowData = debounce(() => {
    let {historyObj} = this.props

    Promise.resolve()
      .then(() => {
        return this.props.dispatch(commitSetFlow([]))
      })
      .then(() => {
        if (historyObj.data) {
          return historyObj.data
        }

        return this.props.dispatch(getHistoryData(historyObj, this.props.auth.token))
      })
      .then((data) => {
        if (!data) return

        historyObj.data = data

        if (historyObj.slug !== this.props.historyObj.slug) return

        return this.setFlow(historyObj.deserialiseFlowData())
      })
      .then(() => {
        if (this.isMounted()) {
          this.setState({fetchedSlug: historyObj.slug})
        }
      })
  }, 500)

  onUpdateFlowData = debounce(() => {
    let {historyObj, stack, user, historyState} = this.props
    if (historyObj.slug !== this.state.fetchedSlug) return

    let data = historyObj.data
    historyObj.serialiseFlowData(stack)
    if ((historyState.username === 'me' || user.username === historyState.username) && historyObj.data !== data) {
      this.props
        .dispatch(setHistoryData(historyObj, this.props.auth.token))
        .catch((log) => {
          return this.props.dispatch(commitAddLog(log.message))
        })
    }
  }, 500)

  onChangeTitle = (event) => {
    this.props
      .dispatch(commitUpdateHistory(new History({...this.props.historyObj, ...{title: event.target.value}})))
      .then(() => {
        this.onUpdate()
      })
  }

  onChangeSlug = (event) => {
    this.props
      .dispatch(commitUpdateHistory(new History({...this.props.historyObj, ...{slug: event.target.value}})))
      .then(() => {
        this.onUpdate()
      })
  }

  onChangePath = (selected) => {
    this.props
      .dispatch(commitUpdateHistory(new History({ ...this.props.historyObj, ...{ path: stringToPath(selected) } })))
      .then(() => {
        this.onUpdate()
      })
  }

  onChangeClient = (selected) => {
    this.props
      .dispatch(commitUpdateHistory(new History({...this.props.historyObj, ...{client: selected}})))
      .then(() => {
        this.onUpdate()
      })
  }

  onChangeTags = (tags) => {
    this.props
      .dispatch(commitUpdateHistory(new History({...this.props.historyObj, ...{tags: tags}})))
      .then(() => {
        this.onUpdate()
      })
  }

  onChangeDescription = (description) => {
    this.props
      .dispatch(commitUpdateHistory(new History({...this.props.historyObj, ...{description: description}})))
      .then(() => {
        this.onUpdate()
      })
  }

  onChangePublic = (value) => {
    this.props
      .dispatch(commitUpdateHistory(new History({...this.props.historyObj, ...{public: value}})))
      .then(() => {
        this.onUpdate()
      })
  }

  onUpdate = debounce(() => {
    this.props.dispatch(updateHistory(this.props.historyObj, this.props.auth.token)).then(() => {
      this.props.history.push(this.itemPathTo(this.props.historyObj))
    })
  }, 500)

  onDuplicate = (event) => {
    event.preventDefault()

    let historyObj = new History(this.props.historyObj)
    historyObj.title += ' Copy'

    this.props.dispatch(createHistory(historyObj, this.props.auth.token))
      .then((item) => {
        Object.assign(historyObj, item)
        return this.props.dispatch(setHistoryData(historyObj, this.props.auth.token))
      })
      .then(() => {
        return this.props.dispatch(setCurrentHistory({type: historyObj.constructor.name, id: historyObj.id}))
      })
      .catch((log) => {
        return this.props.dispatch(commitAddLog(log.message))
      })
  }

  onDelete = (event) => {
    event.preventDefault()

    return this.props.dispatch(deleteHistory(this.props.historyObj, this.props.auth.token))
  }

  onFolderEdit = (event) => {
    event.preventDefault()

    const {historyState} = this.props

    this.props.dispatch(getFolderTree(historyState.username, this.props.auth.token))
      .then((folderTree) => {
        folderTree = folderTree.map((path) => {
          return pathToString(path)
        })

        this.setState({
          folderTreeEdit: true,
          folderTree: folderTree
        })
      })
  }

  getComponents = (userComponents, historyObj) => {
    let componentLabels = []

    for (let i = 0; i < userComponents.length; i++) {
      let key = userComponents[i]

      if (components[key].clients().indexOf(historyObj.client) !== -1) {
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
    const {historyObj, tags, stack, client, user} = this.props
    const {folderTreeEdit, folderTree} = this.state
    const tagsOptions                          = {
      availableTags: tags
    }
    const components                           = this.getComponents(user.components, historyObj)
    const clients                              = {
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
              <a className='btn btn-box-tool' onClick={this.onDuplicate}><i className='fa fa-clone'/></a>
              <a className='btn btn-box-tool' onClick={this.onDelete}><i className='fa fa-times'/></a>
            </div>
          </div>
          <div className='box-body'>
            <form className='form-horizontal'>

              <div className='form-group'>
                <label htmlFor='info_title_{{ _uid }}' className='col-sm-2 control-label'>Title</label>

                <div className='col-sm-10'>
                  <input type='text' className='form-control' id='info_title_{{ _uid }}'
                         value={historyObj.title} onChange={this.onChangeTitle} placeholder='Title'/>
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='info_slug_{{ _uid }}' className='col-sm-2 control-label'>Slug</label>

                <div className='col-sm-10'>
                  <input type='text' className='form-control' id='info_slug_{{ _uid }}'
                         value={historyObj.slug} onChange={this.onChangeSlug} placeholder='Slug'/>
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='info_path_{{ _uid }}' className='col-sm-2 control-label'>Path</label>

                <div className='col-sm-10'>
                  {folderTreeEdit && (
                    <Select2Component value={pathToString(historyObj.path)} onChange={this.onChangePath} className='form-control' id='info_path_{{ _uid }}' style={{ width: '100%' }}>
                      {folderTree.map((value) => (
                        <option key={value} value={value}>{ value }</option>
                      ))}
                    </Select2Component>
                  ) || (
                    <div>
                      <button type="button" className="btn btn-primary" onClick={this.onFolderEdit}><i className="fa fa-edit fa-fw" /></button> {pathToString(historyObj.path)}
                    </div>
                  )}
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='info_client_{{ _uid }}' className='col-sm-2 control-label'>Client</label>

                <div className='col-sm-10'>
                  <Select2Component value={historyObj.client} onChange={this.onChangeClient} className='form-control'
                                    id='info_client_{{ _uid }}' style={{width: '100%'}}>
                    {Object.keys(clients).map((value) => (
                      <option key={value} value={value}>{clients[value]}</option>
                    ))}
                  </Select2Component>
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='info_tags_{{ _uid }}' className='col-sm-2 control-label'>Tags</label>

                <div className='col-sm-10'>
                  <TagItComponent type='text' className='form-control' id='info_tags_{{ _uid }}'
                                  value={historyObj.tags} onChange={this.onChangeTags} options={tagsOptions}
                                  placeholder='Tags'/>
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='info_public_{{ _uid }}' className='col-sm-2 control-label'>Public</label>

                <div className='col-sm-10'>
                  <ICheckBoxComponent value={historyObj.public} onChange={this.onChangePublic}
                                      id='info_public_{{ _uid }}'/>
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='info_description_{{ _uid }}'
                       className='col-sm-2 control-label'>Description</label>

                <div className='col-sm-10'>
                  <AceComponent className='form-control' id='info_description_{{ _uid }}'
                                value={historyObj.description} onChange={this.onChangeDescription}
                                placeholder='Text' height='200'/>
                </div>
              </div>

            </form>
          </div>
          <div className='box-footer'>
            {historyObj.client === 'uniflow' && (
              <a className='btn btn-success' onClick={this.run}><i className='fa fa-fw fa-play'/> Play</a>
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
    historyObj: getCurrentHistory(state.history),
    tags: getTags(state.history),
    historyState: state.history,
    stack: state.flow
  }
})(withRouter(Show))
