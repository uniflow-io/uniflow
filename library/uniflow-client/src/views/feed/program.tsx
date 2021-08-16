import React, { Component } from 'react';
import { navigate } from 'gatsby';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClone, faEdit, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { Ace, Flows, Checkbox, Select } from '../../components';
import Runner from '../../models/runner';
import {
  commitPushFlow,
  commitPopFlow,
  commitUpdateFlow,
  commitSetFlows,
} from '../../reducers/flows/actions';
import {
  getTags,
  commitUpdateFeed,
  createProgram,
  updateProgram,
  deleteProgram,
  getProgramData,
  setProgramData,
  getFolderTree,
  toFeedPath,
  deserializeFlowsData,
  serializeFlowsData,
} from '../../reducers/feed/actions';
import { commitAddLog } from '../../reducers/logs/actions';
import { copyTextToClipboard } from '../../utils';

class Program extends Component {
  state = {
    fetchedSlug: null,
    fetchedUid: null,
    slug: null,
    folderTreeEdit: false,
    folderTree: [],
  };

  componentDidMount() {
    const { program } = this.props;

    this._componentIsMounted = true;
    this._componentShouldUpdate = true;

    this.setState({ folderTree: [program.path] });

    this.onFetchFlowData();
  }

  componentWillUnmount() {
    this._componentIsMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.program.uid !== prevProps.program.uid) {
      this.setState({
        slug: null,
        folderTreeEdit: false,
        folderTree: [this.props.program.path],
      });

      this.onFetchFlowData();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this._componentShouldUpdate;
  }

  onRun = (event, index) => {
    event.preventDefault();

    const { flows } = this.props;

    const runner = new Runner();
    runner.run(flows.slice(0, index === undefined ? flows.length : index + 1));
  };

  setFlows = async (flows) => {
    await this.props.dispatch(commitSetFlows(flows))

    // hack fix to remove
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    return await Promise.all(
      this.props.flows.map((item) => {
        return item.bus.emit('deserialize', item.data);
      })
    );
  };

  onPushFlow = async (index, flow) => {
    await this.props.dispatch(commitPushFlow(index, flow))
    await this.setFlows(this.props.flows)

    this.onUpdateFlowData();
  };

  onPopFlow = async (index) => {
    await this.props.dispatch(commitPopFlow(index))
    await this.setFlows(this.props.flows)

    this.onUpdateFlowData();
  };

  onUpdateFlow = async (index, data) => {
    /** @todo find a way about code generation, for not storing code into the data flows */
    this._componentShouldUpdate = false;
    const clientsCodes = await Promise.all(
      this.props.program.clients.map((client) => {
        return this.props.flows[index].bus.emit('code', client);
      })
    )
    const codes = clientsCodes.reduce((data, codes, clientIndex) => {
      data[this.props.program.clients[clientIndex]] = codes.join(';');
      return data;
    }, {});

    await this.props.dispatch(commitUpdateFlow(index, data, codes));
    this._componentShouldUpdate = true;
    this.onUpdateFlowData()
  };

  onFetchFlowData = debounce(async () => {
    const { program } = this.props;

    await this.props.dispatch(commitSetFlows([]));
    let data = program.data
    if (!data) {
      data = await this.props.dispatch(getProgramData(program, this.props.auth.token));
    }
    if(data) {
      program.data = data;

      if (program.slug === this.props.program.slug) {
        await this.setFlows(deserializeFlowsData(data));
      }
    }
    this._componentShouldUpdate = false;
    if (this._componentIsMounted) {
      this.setState({ fetchedSlug: program.slug });
    }
    this._componentShouldUpdate = true;
  }, 500);

  onUpdateFlowData = debounce(async () => {
    const { program, flows, user, feed } = this.props;
    if (program.slug !== this.state.fetchedSlug) return;

    const data = serializeFlowsData(flows);
    if ((feed.uid === 'me' || user.uid === feed.uid) && program.data !== data) {
      program.data = data;

      this._componentShouldUpdate = false;
      try {
        await this.props.dispatch(setProgramData(program, this.props.auth.token))
        this._componentShouldUpdate = true;
      } catch(error) {
        await this.props.dispatch(commitAddLog(error.message));
      }
    }
  }, 500);

  onChangeTitle = async (event) => {
    await this.props.dispatch(commitUpdateFeed({
      type: 'program',
      entity: {
        ...this.props.program,
        ...{ name: event.target.value },
      },
    }))
    this.onUpdate();
  };

  onChangeSlug = (event) => {
    this.setState({ slug: event.target.value }, this.onUpdate);
  };

  onChangePath = async (selected) => {
    await this.props.dispatch(commitUpdateFeed({
        type: 'program',
        entity: {
          ...this.props.program,
          ...{ path: selected },
        },
      })
    )
    this.onUpdate()
  };

  onChangeClients = async (clients) => {
    await this.props.dispatch(commitUpdateFeed({
          type: 'program',
          entity: {
            ...this.props.program,
            ...{ clients: clients },
          },
        })
      )
    this.onUpdate();
  };

  onChangeTags = async (tags) => {
    await this.props.dispatch(commitUpdateFeed({
        type: 'program',
        entity: {
          ...this.props.program,
          ...{ tags: tags },
        },
      })
    )
    this.onUpdate();
  };

  onChangeDescription = async (description) => {
    await this.props.dispatch(commitUpdateFeed({
        type: 'program',
        entity: {
          ...this.props.program,
          ...{ description: description },
        },
      })
    )
    this.onUpdate();
  };

  onChangePublic = async (value) => {
    await this.props.dispatch(commitUpdateFeed({
        type: 'program',
        entity: {
          ...this.props.program,
          ...{ public: value },
        },
      })
    )
    this.onUpdate();
  };

  onUpdate = debounce(async() => {
    let { program } = this.props;
    program.slug = this.state.slug ?? program.slug;

    program = await this.props.dispatch(updateProgram(program, this.props.auth.token))
    const path = toFeedPath(program, this.props.user);
    if (typeof window !== `undefined` && window.location.pathname !== path) {
      navigate(path);
    }
  }, 500);

  onDuplicate = async (event) => {
    event.preventDefault();

    const program = this.props.program;
    program.name += ' Copy';

    try {
      const item = await this.props.dispatch(createProgram(program, this.props.auth.uid, this.props.auth.token))
      Object.assign(program, item);
      await this.props.dispatch(setProgramData(program, this.props.auth.token));
      navigate(toFeedPath(program, this.props.user));
    } catch(error) {
      return this.props.dispatch(commitAddLog(error.message));
    }
  };

  onDelete = async (event) => {
    event.preventDefault();

    await this.props.dispatch(deleteProgram(this.props.program, this.props.auth.token))
    navigate(toFeedPath(this.props.program, this.props.user, true));
  };

  onFolderEdit = async (event) => {
    event.preventDefault();

    const { feed } = this.props;

    const folderTree = await this.props.dispatch(getFolderTree(feed.uid, this.props.auth.token))
    this.setState({
      folderTreeEdit: true,
      folderTree: folderTree,
    });
  };

  getFlows = (program) => {
    const { allFlows } = this.props;
    const flowLabels = [];
    const keys = Object.keys(allFlows);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const canPushFlow = program.clients.reduce((bool, client) => {
        return bool && allFlows[key].clients.indexOf(client) !== -1;
      }, program.clients.length > 0);

      if (canPushFlow) {
        flowLabels.push({
          key: key,
          label: allFlows[key].tags.join(' - ') + ' : ' + allFlows[key].name,
        });
      }
    }

    flowLabels.sort(function (flow1, flow2) {
      const x = flow1.label;
      const y = flow2.label;
      return x < y ? -1 : x > y ? 1 : 0;
    });

    return flowLabels;
  };

  getNodeClipboard = () => {
    const { program, user } = this.props;

    if (user.apiKey) {
      return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key=${user.apiKey} ${program.slug}`;
    }

    return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key={your-api-key} ${program.slug}`;
  };

  onCopyNodeUsage = (event) => {
    const clipboard = this.getNodeClipboard();

    copyTextToClipboard(clipboard);
  };

  render() {
    const { program, tags, flows, user, allFlows } = this.props;
    const { folderTreeEdit, folderTree } = this.state;
    const programFlows = this.getFlows(program);
    const clients = {
      uniflow: 'Uniflow',
      node: 'Node',
      vscode: 'VSCode',
    };
    program.slug = this.state.slug ?? program.slug;

    return (
      <section className="section col">
        <div className="row">
          <div className="col">
            <h3>Infos</h3>
          </div>
          <div className="d-block col-auto">
            <div className="btn-toolbar" role="toolbar" aria-label="flow actions">
              <div className="btn-group-sm" role="group">
                <button type="button" className="btn text-secondary" onClick={this.onDuplicate}>
                  <FontAwesomeIcon icon={faClone} />
                </button>
                <button type="button" className="btn text-secondary" onClick={this.onDelete}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <form className="form-sm-horizontal">
          <div className="row mb-3">
            <label htmlFor="info_title_{{ _uid }}" className="col-sm-2 col-form-label">
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

          <div className="row mb-3">
            <label htmlFor="info_slug_{{ _uid }}" className="col-sm-2 col-form-label">
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

          <div className="row mb-3">
            <label htmlFor="info_path_{{ _uid }}" className="col-sm-2 col-form-label">
              Path
            </label>

            <div className="col-sm-10">
              {(folderTreeEdit && (
                <Select
                  value={program.path}
                  onChange={this.onChangePath}
                  className="form-control"
                  id="info_path_{{ _uid }}"
                  options={folderTree.map((value) => {
                    return { value: value, label: value };
                  })}
                />
              )) || (
                <div>
                  <button type="button" className="btn btn-secondary" onClick={this.onFolderEdit}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>{' '}
                  {program.path}
                </div>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="info_client_{{ _uid }}" className="col-sm-2 col-form-label">
              Clients
            </label>

            <div className="col-sm-10">
              <Select
                value={program.clients}
                onChange={this.onChangeClients}
                className="form-control"
                id="info_client_{{ _uid }}"
                multiple={true}
                options={Object.keys(clients).map((value) => {
                  return { value: value, label: clients[value] };
                })}
              />
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="info_tags_{{ _uid }}" className="col-sm-2 col-form-label">
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
                options={tags.map((tag) => {
                  return { value: tag, label: tag };
                })}
                placeholder="Tags"
              />
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="info_public_{{ _uid }}" className="col-sm-2 col-form-label">
              Public
            </label>

            <div className="col-sm-10">
              <Checkbox
                className="form-control-plaintext"
                value={program.public}
                onChange={this.onChangePublic}
                id="info_public_{{ _uid }}"
              />
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="info_description_{{ _uid }}" className="col-sm-2 col-form-label">
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
        {program.clients.map((client) => {
          if (client === 'uniflow') {
            return (
              <div key={`client-${client}`} className="row">
                <div className="col">
                  {/* @ts-expect-error ts-migrate(2322) FIXME: Type '(event: any, index: any) => void' is not ass... Remove this comment to see the full error message */}
                  <button className="btn btn-primary" onClick={this.onRun}>
                    <FontAwesomeIcon icon={faPlay} /> Play
                  </button>
                </div>
              </div>
            );
          } else if (client === 'node') {
            const clipboard = this.getNodeClipboard(user);

            return (
              <div key={`client-${client}`} className="row mb-3">
                <label htmlFor="program_node_api_key" className="col-sm-2 col-form-label">
                  Node usage
                </label>
                <div className="col-sm-10">
                  <div className="input-group">
                    <button
                      type="button"
                      className="input-group-text"
                      onClick={this.onCopyNodeUsage}
                    >
                      <FontAwesomeIcon icon={faClipboard} />
                    </button>
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
            );
          }

          return null;
        })}

        <hr />

        <Flows
          flows={flows}
          allFlows={allFlows}
          programFlows={programFlows}
          clients={program.clients}
          onPush={this.onPushFlow}
          onPop={this.onPopFlow}
          onUpdate={this.onUpdateFlow}
          onRun={this.onRun}
        />
      </section>
    );
  }
}

export default connect((state) => {
  return {
    auth: state.auth,
    user: state.user,
    tags: getTags(state.feed),
    feed: state.feed,
    flows: state.flows,
  };
})(Program);
