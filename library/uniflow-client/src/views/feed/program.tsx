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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { program } = this.props;

    // @ts-expect-error ts-migrate(2551) FIXME: Property '_componentIsMounted' does not exist on t... Remove this comment to see the full error message
    this._componentIsMounted = true;
    // @ts-expect-error ts-migrate(2339) FIXME: Property '_componentShouldUpdate' does not exist o... Remove this comment to see the full error message
    this._componentShouldUpdate = true;

    this.setState({ folderTree: [program.path] });

    this.onFetchFlowData();
  }

  componentWillUnmount() {
    // @ts-expect-error ts-migrate(2551) FIXME: Property '_componentIsMounted' does not exist on t... Remove this comment to see the full error message
    this._componentIsMounted = false;
  }

  componentDidUpdate(prevProps) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
    if (this.props.program.uid !== prevProps.program.uid) {
      this.setState({
        slug: null,
        folderTreeEdit: false,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
        folderTree: [this.props.program.path],
      });

      this.onFetchFlowData();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property '_componentShouldUpdate' does not exist o... Remove this comment to see the full error message
    return this._componentShouldUpdate;
  }

  onRun = (event, index) => {
    event.preventDefault();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'flows' does not exist on type 'Readonly<... Remove this comment to see the full error message
    const { flows } = this.props;

    const runner = new Runner();
    runner.run(flows.slice(0, index === undefined ? flows.length : index + 1));
  };

  setFlows = (flows) => {
    return (
      this.props
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        .dispatch(commitSetFlows(flows))
        .then(() => {
          // hack fix to remove
          return new Promise((resolve) => {
            setTimeout(resolve, 500);
          });
        })
        .then(() => {
          return Promise.all(
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'flows' does not exist on type 'Readonly<... Remove this comment to see the full error message
            this.props.flows.map((item) => {
              return item.bus.emit('deserialize', item.data);
            })
          );
        })
    );
  };

  onPushFlow = (index, flow) => {
    this.props
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      .dispatch(commitPushFlow(index, flow))
      .then(() => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'flows' does not exist on type 'Readonly<... Remove this comment to see the full error message
        return this.setFlows(this.props.flows);
      })
      .then(this.onUpdateFlowData);
  };

  onPopFlow = (index) => {
    this.props
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      .dispatch(commitPopFlow(index))
      .then(() => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'flows' does not exist on type 'Readonly<... Remove this comment to see the full error message
        return this.setFlows(this.props.flows);
      })
      .then(this.onUpdateFlowData);
  };

  onUpdateFlow = (index, data) => {
    /** @todo find a way about code generation, for not storing code into the data flows */
    // @ts-expect-error ts-migrate(2339) FIXME: Property '_componentShouldUpdate' does not exist o... Remove this comment to see the full error message
    this._componentShouldUpdate = false;
    Promise.all(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
      this.props.program.clients.map((client) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'flows' does not exist on type 'Readonly<... Remove this comment to see the full error message
        return this.props.flows[index].bus.emit('code', client);
      })
    )
      .then((clientsCodes) => {
        const codes = clientsCodes.reduce((data, codes, clientIndex) => {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
          data[this.props.program.clients[clientIndex]] = codes.join(';');
          return data;
        }, {});

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        return this.props.dispatch(commitUpdateFlow(index, data, codes));
      })
      .then(() => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_componentShouldUpdate' does not exist o... Remove this comment to see the full error message
        this._componentShouldUpdate = true;
      })
      .then(this.onUpdateFlowData);
  };

  onFetchFlowData = debounce(() => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { program } = this.props;

    Promise.resolve()
      .then(() => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        return this.props.dispatch(commitSetFlows([]));
      })
      .then(() => {
        if (program.data) {
          return program.data;
        }

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        return this.props.dispatch(getProgramData(program, this.props.auth.token));
      })
      .then((data) => {
        if (!data) return;

        program.data = data;

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
        if (program.slug !== this.props.program.slug) return;

        return this.setFlows(deserializeFlowsData(data));
      })
      .then(() => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_componentShouldUpdate' does not exist o... Remove this comment to see the full error message
        this._componentShouldUpdate = false;
      })
      .then(() => {
        // @ts-expect-error ts-migrate(2551) FIXME: Property '_componentIsMounted' does not exist on t... Remove this comment to see the full error message
        if (this._componentIsMounted) {
          this.setState({ fetchedSlug: program.slug });
        }
      })
      .then(() => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_componentShouldUpdate' does not exist o... Remove this comment to see the full error message
        this._componentShouldUpdate = true;
      });
  }, 500);

  onUpdateFlowData = debounce(() => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { program, flows, user, feed } = this.props;
    if (program.slug !== this.state.fetchedSlug) return;

    const data = serializeFlowsData(flows);
    if ((feed.uid === 'me' || user.uid === feed.uid) && program.data !== data) {
      program.data = data;

      // @ts-expect-error ts-migrate(2339) FIXME: Property '_componentShouldUpdate' does not exist o... Remove this comment to see the full error message
      this._componentShouldUpdate = false;
      this.props
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        .dispatch(setProgramData(program, this.props.auth.token))
        .then(() => {
          // @ts-expect-error ts-migrate(2339) FIXME: Property '_componentShouldUpdate' does not exist o... Remove this comment to see the full error message
          this._componentShouldUpdate = true;
        })
        .catch((log) => {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
          return this.props.dispatch(commitAddLog(log.message));
        });
    }
  }, 500);

  onChangeTitle = (event) => {
    this.props
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      .dispatch(
        commitUpdateFeed({
          type: 'program',
          entity: {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
            ...this.props.program,
            ...{ name: event.target.value },
          },
        })
      )
      .then(this.onUpdate);
  };

  onChangeSlug = (event) => {
    this.setState({ slug: event.target.value }, this.onUpdate);
  };

  onChangePath = (selected) => {
    this.props
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      .dispatch(
        commitUpdateFeed({
          type: 'program',
          entity: {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
            ...this.props.program,
            ...{ path: selected },
          },
        })
      )
      .then(this.onUpdate);
  };

  onChangeClients = (clients) => {
    this.props
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      .dispatch(
        commitUpdateFeed({
          type: 'program',
          entity: {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
            ...this.props.program,
            ...{ clients: clients },
          },
        })
      )
      .then(this.onUpdate);
  };

  onChangeTags = (tags) => {
    this.props
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      .dispatch(
        commitUpdateFeed({
          type: 'program',
          entity: {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
            ...this.props.program,
            ...{ tags: tags },
          },
        })
      )
      .then(this.onUpdate);
  };

  onChangeDescription = (description) => {
    this.props
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      .dispatch(
        commitUpdateFeed({
          type: 'program',
          entity: {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
            ...this.props.program,
            ...{ description: description },
          },
        })
      )
      .then(this.onUpdate);
  };

  onChangePublic = (value) => {
    this.props
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      .dispatch(
        commitUpdateFeed({
          type: 'program',
          entity: {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
            ...this.props.program,
            ...{ public: value },
          },
        })
      )
      .then(this.onUpdate);
  };

  onUpdate = debounce(() => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { program } = this.props;
    program.slug = this.state.slug ?? program.slug;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    this.props.dispatch(updateProgram(program, this.props.auth.token)).then((program) => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
      const path = toFeedPath(program, this.props.user);
      if (typeof window !== `undefined` && window.location.pathname !== path) {
        navigate(path);
      }
    });
  }, 500);

  onDuplicate = (event) => {
    event.preventDefault();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
    const program = this.props.program;
    program.name += ' Copy';

    this.props
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      .dispatch(createProgram(program, this.props.auth.uid, this.props.auth.token))
      .then((item) => {
        Object.assign(program, item);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        return this.props.dispatch(setProgramData(program, this.props.auth.token));
      })
      .then(() => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
        return navigate(toFeedPath(program, this.props.user));
      })
      .catch((log) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        return this.props.dispatch(commitAddLog(log.message));
      });
  };

  onDelete = (event) => {
    event.preventDefault();

    return (
      this.props
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        .dispatch(deleteProgram(this.props.program, this.props.auth.token))
        .then(() => {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
          return navigate(toFeedPath(this.props.program, this.props.user, true));
        })
    );
  };

  onFolderEdit = (event) => {
    event.preventDefault();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'feed' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { feed } = this.props;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    this.props.dispatch(getFolderTree(feed.uid, this.props.auth.token)).then((folderTree) => {
      this.setState({
        folderTreeEdit: true,
        folderTree: folderTree,
      });
    });
  };

  getFlows = (program) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'allFlows' does not exist on type 'Readon... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
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

  getRustClipboard = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { program, user } = this.props;

    if (user.apiKey) {
      return `V8_PATH=/path/to/v8 cargo run -- --api-key=${user.apiKey} ${program.slug}`;
    }

    return `V8_PATH=/path/to/v8 cargo run -- --api-key={your-api-key} ${program.slug}`;
  };

  onCopyRustUsage = (event) => {
    const clipboard = this.getRustClipboard();

    copyTextToClipboard(clipboard);
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
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
                <button type="button" className="btn" onClick={this.onDuplicate}>
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
                  // @ts-expect-error ts-migrate(2322) FIXME: Type '{ value: any; onChange: (selected: any) => v... Remove this comment to see the full error message
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
                // @ts-expect-error ts-migrate(2322) FIXME: Type '{ value: any; onChange: (clients: any) => vo... Remove this comment to see the full error message
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
                // @ts-expect-error ts-migrate(2322) FIXME: Type '{ value: any; onChange: (tags: any) => void;... Remove this comment to see the full error message
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
                // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
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
                // @ts-expect-error ts-migrate(2322) FIXME: Type '{ className: string; id: string; value: any;... Remove this comment to see the full error message
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
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
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
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    auth: state.auth,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    user: state.user,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'feed' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    tags: getTags(state.feed),
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'feed' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    feed: state.feed,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'flows' does not exist on type 'DefaultRo... Remove this comment to see the full error message
    flows: state.flows,
  };
})(Program);
