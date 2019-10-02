import React, { Component } from 'react'
import { navigate } from 'gatsby'
import debounce from 'lodash/debounce'
import {
  AceComponent,
  ListComponent,
  TagItComponent,
  ICheckBoxComponent,
  Select2Component,
} from 'uniflow/src/components'
import Runner from 'uniflow-uniflow-client/src/runner'
import {
  commitPushFlow,
  commitPopFlow,
  commitUpdateFlow,
  commitSetFlow,
} from 'uniflow/src/reducers/flow/actions'
import {
  getCurrentProgram,
  getTags,
  commitUpdateFeed,
  createProgram,
  updateProgram,
  deleteProgram,
  getProgramData,
  setProgramData,
  setCurrentFeed,
  getFolderTree,
  pathToString,
  stringToPath,
  feedPathTo,
  deserialiseFlowData,
  serialiseFlowData,
} from '../../../reducers/feed/actions'
import { commitAddLog } from '../../../reducers/logs/actions'
import { connect } from 'react-redux'
import flows from '../../../flows'

class ProgramShow extends Component {
  state = {
    fetchedSlug: null,
    fetchedUsername: null,
    runIndex: null,
    folderTreeEdit: false,
    folderTree: [],
  }

  componentDidMount() {
    const { program } = this.props

    this._componentIsMounted = true

    this.setState({ folderTree: [pathToString(program.path)] })

    this.onFetchFlowData()
  }

  componentWillUnmount() {
    this._componentIsMounted = false
  }

  componentWillReceiveProps(nextProps) {
    const oldProps = this.props

    if (nextProps.program.id !== oldProps.program.id) {
      this.setState({
        folderTreeEdit: false,
        folderTree: [pathToString(nextProps.program.path)],
      })

      this.onFetchFlowData()
    }
  }

  componentIsMounted = () => {
    return this._componentIsMounted
  }

  run = (event, index) => {
    event.preventDefault()

    let stack =
      index === undefined
        ? this.props.stack
        : this.props.stack.slice(0, index + 1)

    let runner = new Runner()

    runner.run(stack, index => {
      return new Promise(resolve => {
        this.setState({ runIndex: index }, resolve)
      })
    })
  }

  setFlow = stack => {
    return this.props.dispatch(commitSetFlow(stack)).then(() => {
      return Promise.all(
        stack.map(item => {
          return item.bus.emit('reset', item.data)
        })
      )
    })
  }

  onPushFlow = (index, flow) => {
    this.props
      .dispatch(commitPushFlow(index, flow))
      .then(() => {
        return this.setFlow(this.props.stack)
      })
      .then(() => {
        this.onUpdateFlowData()
      })
  }

  onPopFlow = index => {
    this.props
      .dispatch(commitPopFlow(index))
      .then(() => {
        return this.setFlow(this.props.stack)
      })
      .then(() => {
        this.onUpdateFlowData()
      })
  }

  onUpdateFlow = (index, data) => {
    /* @todo find a way for not storing code into the data flow */
    this.props.stack[index].bus.emit('code', this.props.program.client)
      .then(codes => {
        let code = codes.join(';')
        return this.props.dispatch(commitUpdateFlow(index, data, code))
      }).then(() => {
        this.onUpdateFlowData()
      })
  }

  onFetchFlowData = debounce(() => {
    let { program } = this.props

    Promise.resolve()
      .then(() => {
        return this.props.dispatch(commitSetFlow([]))
      })
      .then(() => {
        if (program.data) {
          return program.data
        }

        return this.props.dispatch(
          getProgramData(program, this.props.auth.token)
        )
      })
      .then(data => {
        if (!data) return

        program.data = data

        if (program.slug !== this.props.program.slug) return

        return this.setFlow(deserialiseFlowData(data))
      })
      .then(() => {
        if (this.componentIsMounted()) {
          this.setState({ fetchedSlug: program.slug })
        }
      })
  }, 500)

  onUpdateFlowData = debounce(() => {
    let { program, stack, user, feed } = this.props
    if (program.slug !== this.state.fetchedSlug) return

    let data = serialiseFlowData(stack)
    if (
      (feed.username === 'me' || user.username === feed.username) &&
      program.data !== data
    ) {
      program.data = data

      this.props
        .dispatch(setProgramData(program, this.props.auth.token))
        .catch(log => {
          return this.props.dispatch(commitAddLog(log.message))
        })
    }
  }, 500)

  onChangeTitle = event => {
    this.props
      .dispatch(
        commitUpdateFeed({
          ...this.props.program,
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
        commitUpdateFeed({
          ...this.props.program,
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
        commitUpdateFeed({
          ...this.props.program,
          ...{ path: stringToPath(selected) },
        })
      )
      .then(() => {
        this.onUpdate()
      })
  }

  onChangeClient = selected => {
    this.props
      .dispatch(
        commitUpdateFeed({ ...this.props.program, ...{ client: selected } })
      )
      .then(() => {
        this.onUpdate()
      })
  }

  onChangeTags = tags => {
    this.props
      .dispatch(commitUpdateFeed({ ...this.props.program, ...{ tags: tags } }))
      .then(() => {
        this.onUpdate()
      })
  }

  onChangeDescription = description => {
    this.props
      .dispatch(
        commitUpdateFeed({
          ...this.props.program,
          ...{ description: description },
        })
      )
      .then(() => {
        this.onUpdate()
      })
  }

  onChangePublic = value => {
    this.props
      .dispatch(
        commitUpdateFeed({ ...this.props.program, ...{ public: value } })
      )
      .then(() => {
        this.onUpdate()
      })
  }

  onUpdate = debounce(() => {
    this.props
      .dispatch(updateProgram(this.props.program, this.props.auth.token))
      .then(() => {
        navigate(this.itemPathTo(this.props.program))
      })
  }, 500)

  onDuplicate = event => {
    event.preventDefault()

    let program = this.props.program
    program.title += ' Copy'

    this.props
      .dispatch(createProgram(program, this.props.auth.token))
      .then(item => {
        Object.assign(program, item)
        return this.props.dispatch(
          setProgramData(program, this.props.auth.token)
        )
      })
      .then(() => {
        return this.props.dispatch(
          setCurrentFeed({ type: program.type, id: program.id })
        )
      })
      .catch(log => {
        return this.props.dispatch(commitAddLog(log.message))
      })
  }

  onDelete = event => {
    event.preventDefault()

    return this.props.dispatch(
      deleteProgram(this.props.program, this.props.auth.token)
    )
  }

  onFolderEdit = event => {
    event.preventDefault()

    const { feed } = this.props

    this.props
      .dispatch(getFolderTree(feed.username, this.props.auth.token))
      .then(folderTree => {
        folderTree = folderTree.map(path => {
          return pathToString(path)
        })

        this.setState({
          folderTreeEdit: true,
          folderTree: folderTree,
        })
      })
  }

  getFlows = (userFlows, program) => {
    let flowLabels = []

    for (let i = 0; i < userFlows.length; i++) {
      let key = userFlows[i]

      if (flows[key].clients().indexOf(program.client) !== -1) {
        flowLabels.push({
          key: key,
          label: flows[key].tags().join(' - ') + ' : ' + key,
        })
      }
    }

    flowLabels.sort(function(flow1, flow2) {
      let x = flow1.label
      let y = flow2.label
      return x < y ? -1 : x > y ? 1 : 0
    })

    return flowLabels
  }

  itemPathTo = item => {
    const isCurrentUser =
      this.props.feed.username &&
      this.props.feed.username === this.props.user.username

    let path = item.path.slice()
    path.push(item.slug)
    return feedPathTo(path, isCurrentUser ? this.props.feed.username : null)
  }

  render() {
    const { program, tags, stack, user } = this.props
    const { folderTreeEdit, folderTree } = this.state
    const userFlows = this.getFlows(user.flows, program)
    const clients = {
      uniflow: 'Uniflow',
      bash: 'Bash',
      phpstorm: 'PhpStorm',
      chrome: 'Chrome',
    }

    return (
      <div>
        <div className="box box-primary">
          <div className="box-header with-border">
            <h3 className="box-title">Infos</h3>
            <div className="box-tools pull-right">
              <button className="btn btn-box-tool" onClick={this.onDuplicate}>
                <i className="fa fa-clone" />
              </button>
              <button className="btn btn-box-tool" onClick={this.onDelete}>
                <i className="fa fa-times" />
              </button>
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
                    value={program.title}
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
                    value={program.slug}
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
                      value={pathToString(program.path)}
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
                      {pathToString(program.path)}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor="info_client_{{ _uid }}"
                  className="col-sm-2 control-label"
                >
                  Client
                </label>

                <div className="col-sm-10">
                  <Select2Component
                    value={program.client}
                    onChange={this.onChangeClient}
                    className="form-control"
                    id="info_client_{{ _uid }}"
                    options={Object.keys(clients).map(value => {
                      return { value: value, label: clients[value] }
                    })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor="info_tags_{{ _uid }}"
                  className="col-sm-2 control-label"
                >
                  Tags
                </label>

                <div className="col-sm-10">
                  <TagItComponent
                    type="text"
                    className="form-control"
                    id="info_tags_{{ _uid }}"
                    value={program.tags}
                    onChange={this.onChangeTags}
                    options={tags.map(tag => {
                      return { value: tag, label: tag }
                    })}
                    placeholder="Tags"
                  />
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor="info_public_{{ _uid }}"
                  className="col-sm-2 control-label"
                >
                  Public
                </label>

                <div className="col-sm-10">
                  <ICheckBoxComponent
                    value={program.public}
                    onChange={this.onChangePublic}
                    id="info_public_{{ _uid }}"
                  />
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor="info_description_{{ _uid }}"
                  className="col-sm-2 control-label"
                >
                  Description
                </label>

                <div className="col-sm-10">
                  <AceComponent
                    className="form-control"
                    id="info_description_{{ _uid }}"
                    value={program.description}
                    onChange={this.onChangeDescription}
                    placeholder="Text"
                    height="200"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="box-footer">
            {program.client === 'uniflow' && (
              <button className="btn btn-success" onClick={this.run}>
                <i className="fa fa-fw fa-play" /> Play
              </button>
            )}
          </div>
        </div>

        <ListComponent
          stack={stack}
          runIndex={this.state.runIndex}
          flows={flows}
          userFlows={userFlows}
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
    program: getCurrentProgram(state.feed),
    tags: getTags(state.feed),
    feed: state.feed,
    stack: state.flow,
  }
})(ProgramShow)
