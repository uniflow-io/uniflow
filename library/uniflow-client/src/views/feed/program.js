import React, { Component } from 'react'
import { navigate, Link } from 'gatsby'
import debounce from 'lodash/debounce'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTimes,
  faClone,
  faEdit,
  faPlay,
} from '@fortawesome/free-solid-svg-icons'
import { faClipboard } from '@fortawesome/free-regular-svg-icons'
import { Ace, Rail, Checkbox, Select } from '../../components'
import Runner from '../../models/runner'
import {
  commitPushFlow,
  commitPopFlow,
  commitUpdateFlow,
  commitSetRail,
} from '../../reducers/rail/actions'
import {
  getTags,
  commitUpdateFeed,
  createProgram,
  updateProgram,
  deleteProgram,
  getProgramData,
  setProgramData,
  setSlugFeed,
  getFolderTree,
  toFeedPath,
  deserializeRailData,
  serializeRailData,
} from '../../reducers/feed/actions'
import { commitAddLog } from '../../reducers/logs/actions'
import { copyTextToClipboard } from '../../utils'
import { pathTo } from '../../routes'

class Program extends Component {
  state = {
    fetchedSlug: null,
    fetchedUid: null,
    folderTreeEdit: false,
    folderTree: [],
  }

  componentDidMount() {
    const { program } = this.props

    this._componentIsMounted = true
    this._componentShouldUpdate = true

    this.setState({ folderTree: [program.path] })

    this.onFetchFlowData()
  }

  componentWillUnmount() {
    this._componentIsMounted = false
  }

  componentDidUpdate(prevProps) {
    if (this.props.program.id !== prevProps.program.id) {
      this.setState({
        folderTreeEdit: false,
        folderTree: [this.props.program.path],
      })

      this.onFetchFlowData()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this._componentShouldUpdate
  }

  onRun = (event, index) => {
    event.preventDefault()

    const { rail } = this.props

    let runner = new Runner()
    runner.run(rail.slice(0, index === undefined ? rail.length : index + 1))
  }

  setRail = (rail) => {
    return this.props
      .dispatch(commitSetRail(rail))
      .then(() => {
        // hack fix to remove
        return new Promise((resolve) => {
          setTimeout(resolve, 500)
        })
      })
      .then(() => {
        return Promise.all(
          this.props.rail.map(item => {
            return item.bus.emit('deserialize', item.data)
          })
        )
      })
  }

  onPushFlow = (index, flow) => {
    this.props
      .dispatch(commitPushFlow(index, flow))
      .then(() => {
        return this.setRail(this.props.rail)
      })
      .then(this.onUpdateFlowData)
  }

  onPopFlow = index => {
    this.props
      .dispatch(commitPopFlow(index))
      .then(() => {
        return this.setRail(this.props.rail)
      })
      .then(this.onUpdateFlowData)
  }

  onUpdateFlow = (index, data) => {
    /** @todo find a way about code generation, for not storing code into the data rail */
    this._componentShouldUpdate = false
    Promise
      .all(this.props.program.clients.map(client => {
        return this.props.rail[index].bus.emit('code', client)
      }))
      .then(clientsCodes => {
        const codes = clientsCodes.reduce((data, codes, clientIndex) => {
          data[this.props.program.clients[clientIndex]] = codes.join(';')
          return data
        }, {})

        return this.props.dispatch(commitUpdateFlow(index, data, codes))
      })
      .then(() => {
        this._componentShouldUpdate = true
      })
      .then(this.onUpdateFlowData)
  }

  onFetchFlowData = debounce(() => {
    let { program } = this.props

    Promise.resolve()
      .then(() => {
        return this.props.dispatch(commitSetRail([]))
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

        return this.setRail(deserializeRailData(data))
      })
      .then(() => {
        this._componentShouldUpdate = false
      })
      .then(() => {
        if (this._componentIsMounted) {
          this.setState({ fetchedSlug: program.slug })
        }
      })
      .then(() => {
        this._componentShouldUpdate = true
      })
  }, 500)

  onUpdateFlowData = debounce(() => {
    let { program, rail, user, feed } = this.props
    if (program.slug !== this.state.fetchedSlug) return

    let data = serializeRailData(rail)
    if (
      (feed.uid === 'me' || user.uid === feed.uid) &&
      program.data !== data
    ) {
      program.data = data

      this._componentShouldUpdate = false
      this.props
        .dispatch(setProgramData(program, this.props.auth.token))
        .then(() => {
          this._componentShouldUpdate = true
        })
        .catch(log => {
          return this.props.dispatch(commitAddLog(log.message))
        })
    }
  }, 500)

  onChangeTitle = event => {
    this.props
      .dispatch(commitUpdateFeed({
        type: 'program',
        entity: {
          ...this.props.program,
          ...{ name: event.target.value },
        }
      }))
      .then(this.onUpdate)
  }

  onChangeSlug = event => {
    this.props
      .dispatch(commitUpdateFeed({
        type: 'program',
        entity: {
          ...this.props.program,
          ...{ slug: event.target.value },
        }
      }))
      .then(this.onUpdate)
  }

  onChangePath = selected => {
    this.props
      .dispatch(commitUpdateFeed({
        type: 'program',
        entity: {
          ...this.props.program,
          ...{ path: selected },
        }
      }))
      .then(this.onUpdate)
  }

  onChangeClients = clients => {
    this.props
      .dispatch(commitUpdateFeed({
        type: 'program',
        entity: {
          ...this.props.program,
          ...{ clients: clients }
        }
      }))
      .then(this.onUpdate)
  }

  onChangeTags = tags => {
    this.props
      .dispatch(commitUpdateFeed({
        type: 'program',
        entity: {
          ...this.props.program,
          ...{ tags: tags }
        }
      }))
      .then(this.onUpdate)
  }

  onChangeDescription = description => {
    this.props
      .dispatch(commitUpdateFeed({
        type: 'program',
        entity: {
          ...this.props.program,
          ...{ description: description },
        }
      }))
      .then(this.onUpdate)
  }

  onChangePublic = value => {
    this.props
      .dispatch(commitUpdateFeed({
        type: 'program',
        entity: {
          ...this.props.program,
          ...{ public: value }
        }
      }))
      .then(this.onUpdate)
  }

  onUpdate = debounce(() => {
    this.props
      .dispatch(updateProgram(this.props.program, this.props.auth.token))
      .then(() => {
        const path = toFeedPath(this.props.program, this.props.user)
        if (typeof window !== `undefined` && window.location.pathname !== path) {
          navigate(path)
        }
      })
  }, 500)

  onDuplicate = event => {
    event.preventDefault()

    let program = this.props.program
    program.name += ' Copy'

    this.props
      .dispatch(createProgram(program, this.props.auth.uid, this.props.auth.token))
      .then(item => {
        Object.assign(program, item)
        return this.props.dispatch(
          setProgramData(program, this.props.auth.token)
        )
      })
      .then(() => {
        return this.props.dispatch(
          setSlugFeed({ type: program.type, id: program.id })
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
      .dispatch(getFolderTree(feed.uid, this.props.auth.token))
      .then(folderTree => {
        this.setState({
          folderTreeEdit: true,
          folderTree: folderTree,
        })
      })
  }

  getFlows = (program) => {
    const { flows } = this.props
    let flowLabels = []
    let keys = Object.keys(flows)

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      const canPushFlow = program.clients.reduce((bool, client) => {
        return bool && flows[key].clients.indexOf(client) !== -1
      }, program.clients.length > 0)

      if (canPushFlow) {
        flowLabels.push({
          key: key,
          label: flows[key].tags.join(' - ') + ' : ' + flows[key].name,
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

  getNodeClipboard = () => {
    let { program, user } = this.props

    if (user.apiKey) {
      return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key=${user.apiKey} ${program.slug}`
    }

    return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key={your-api-key} ${program.slug}`
  }

  onCopyNodeUsage = event => {
    const clipboard = this.getNodeClipboard()

    copyTextToClipboard(clipboard)
  }

  getRustClipboard = () => {
    let { program, user } = this.props

    if (user.apiKey) {
      return `V8_PATH=/path/to/v8 cargo run -- --api-key=${user.apiKey} ${program.slug}`
    }

    return `V8_PATH=/path/to/v8 cargo run -- --api-key={your-api-key} ${program.slug}`
  }

  onCopyRustUsage = event => {
    const clipboard = this.getRustClipboard()

    copyTextToClipboard(clipboard)
  }

  render() {
    const { program, tags, rail, user, flows } = this.props
    const { folderTreeEdit, folderTree } = this.state
    const userFlows = this.getFlows(program)
    const clients = {
      uniflow: 'Uniflow',
      node: 'Node',
      jetbrains: 'Jetbrains',
      chrome: 'Chrome',
      rust: 'Rust',
    }

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
              aria-label="flow actions"
            >
              <div className="btn-group-sm" role="group">
                <button
                  type="button"
                  className="btn"
                  onClick={this.onDuplicate}
                >
                  <FontAwesomeIcon icon={faClone} />
                </button>
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
              htmlFor="info_title_{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Title
            </label>

            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="info_title_{{ _uid }}"
                value={program.name}
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
                value={program.slug}
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
                  value={program.path}
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
                  {program.path}
                </div>
              )}
            </div>
          </div>

          <div className="form-group row">
            <label
              htmlFor="info_client_{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Clients
            </label>

            <div className="col-sm-10">
              <Select
                value={program.clients}
                onChange={this.onChangeClients}
                className="form-control"
                id="info_client_{{ _uid }}"
                multiple={true}
                options={Object.keys(clients).map(value => {
                  return { value: value, label: clients[value] }
                })}
              />
            </div>
          </div>

          <div className="form-group row">
            <label
              htmlFor="info_tags_{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Tags
            </label>

            <div className="col-sm-10">
              <Select
                value={program.tags}
                onChange={this.onChangeTags}
                className="form-control"
                id="info_tags_{{ _uid }}"
                edit={true}
                multiple={true}
                options={tags.map(tag => {
                  return { value: tag, label: tag }
                })}
                placeholder="Tags"
              />
            </div>
          </div>

          <div className="form-group row">
            <label
              htmlFor="info_public_{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Public
            </label>

            {user.uid && (
              <div className="col-sm-10">
                <Checkbox
                  className="form-control-plaintext"
                  value={program.public}
                  onChange={this.onChangePublic}
                  id="info_public_{{ _uid }}"
                />
              </div>
            )}
            {!user.uid && (
              <div className="col-sm-10 col-form-label">
                <Link to={pathTo('settings')}>set your uid</Link>
              </div>
            )}
          </div>

          <div className="form-group row">
            <label
              htmlFor="info_description_{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Description
            </label>

            <div className="col-sm-10">
              <Ace
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
        {program.clients.map(client => {
          if (client === 'uniflow') {
            return (
              <div key={`client-${client}`} className="row">
                <div className="col">
                  <button className="btn btn-success" onClick={this.onRun}>
                    <FontAwesomeIcon icon={faPlay} /> Play
                  </button>
                </div>
              </div>
            )
          } else if (client === 'node') {
            const clipboard = this.getNodeClipboard(user)

            return (
              <div key={`client-${client}`} className="form-group row">
                <label
                  htmlFor="program_node_api_key"
                  className="col-sm-2 col-form-label"
                >
                  Node usage
                </label>
                <div className="col-sm-10">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <button
                        type="button"
                        className="input-group-text"
                        onClick={this.onCopyNodeUsage}
                      >
                        <FontAwesomeIcon icon={faClipboard} />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="program_node_api_key"
                      value={clipboard || ''}
                      readOnly
                      placeholder="api key"
                    />
                  </div>
                </div>
              </div>
            )
          } else if (client === 'rust') {
            const clipboard = this.getRustClipboard(user)

            return (
              <div key={`client-${client}`} className="form-group row">
                <label
                  htmlFor="program_node_api_rust"
                  className="col-sm-2 col-form-label"
                >
                  Rust usage
                </label>
                <div className="col-sm-10">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <button
                        type="button"
                        className="input-group-text"
                        onClick={this.onCopyRustUsage}
                      >
                        <FontAwesomeIcon icon={faClipboard} />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="program_node_api_rust"
                      value={clipboard || ''}
                      readOnly
                      placeholder="api key"
                    />
                  </div>
                </div>
              </div>
            )
          }

          return null
        })}

        <hr />

        <Rail
          rail={rail}
          flows={flows}
          userFlows={userFlows}
          clients={program.clients}
          onPush={this.onPushFlow}
          onPop={this.onPopFlow}
          onUpdate={this.onUpdateFlow}
          onRun={this.onRun}
        />
      </section>
    )
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    user: state.user,
    tags: getTags(state.feed),
    feed: state.feed,
    rail: state.rail,
  }
})(Program)
