import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import debounce from 'lodash/debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClone, faEdit, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { Editor, Flows, Checkbox, Select } from '../../components';
import Runner from '../../models/runner';
import {
  commitPushFlow,
  commitPopFlow,
  commitUpdateFlow,
  commitSetFlows,
} from '../../contexts/graph';
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
  useFeed,
  ProgramFeedType,
} from '../../contexts/feed';
import { commitAddLog, useLogs } from '../../contexts/logs';
import Container from '../../container';
import { UI } from '../../services';
import { useAuth, useGraph, useUser } from '../../contexts';

const container = new Container();
const ui = container.get(UI);

export interface Flow {
  clients: string[]
  name: string
  tags: string[]
}

export interface ProgramProps {
  allFlows: {[key: string] : Flow}
  program: ProgramFeedType
}

export interface ProgramState {}

function Program(props: ProgramProps) {
  const [state, setState] = useState<ProgramState>({
    fetchedSlug: null,
    fetchedUid: null,
    slug: null,
    folderTreeEdit: false,
    folderTree: [],
  });
  const { auth } = useAuth()
  const { logsDispatch } = useLogs()
  const { user } = useUser()
  const { feed, feedDispatch } = useFeed()
  const { graph, graphDispatch } = useGraph()
  const tags = getTags(feed)

  let _componentIsMounted = false;
  let _componentShouldUpdate = false;

  useEffect(() => {
    setState({
      slug: null,
      folderTreeEdit: false,
      folderTree: [props.program.path],
    });

    onFetchFlowData();

    return () => {
      _componentIsMounted = false;
    }
  }, [props.program.uid])

  //shouldComponentUpdate(nextProps, nextState) {
  //  return _componentShouldUpdate;
  //}

  const onRun = (event, index) => {
    event.preventDefault();

    const { graph } = props;

    const runner = new Runner();
    runner.run(graph.slice(0, index === undefined ? graph.length : index + 1));
  };

  const onPushFlow = async (index, flow) => {
    await commitPushFlow(index, flow)(graphDispatch);

    onUpdateFlowData();
  };

  const onPopFlow = async (index) => {
    await commitPopFlow(index)(graphDispatch);

    onUpdateFlowData();
  };

  const onUpdateFlow = async (index, data) => {
    _componentShouldUpdate = false;
    await commitUpdateFlow(index, data)(graphDispatch);
    _componentShouldUpdate = true;
    onUpdateFlowData();
  };

  const onFetchFlowData = debounce(async () => {
    const { program } = props;

    await commitSetFlows([])(graphDispatch);
    let data = program.data;
    if (!data) {
      data = await getProgramData(program, auth.token)(feedDispatch);
    }
    if (data) {
      program.data = data;

      if (program.slug === props.program.slug) {
        await commitSetFlows(deserializeFlowsData(data))(graphDispatch);
      }
    }
    if (_componentIsMounted) {
      _componentShouldUpdate = false;
      setState({ fetchedSlug: program.slug }, () => {
        _componentShouldUpdate = true;
      });
    }
  }, 1000);

  const onUpdateFlowData = debounce(async () => {
    const { program, graph, feed } = props;
    if (program.slug !== state.fetchedSlug) return;

    const data = serializeFlowsData(graph);
    if ((feed.uid === 'me' || user.uid === feed.uid) && program.data !== data) {
      program.data = data;

      _componentShouldUpdate = false;
      try {
        await setProgramData(program, auth.token)(feedDispatch);
        _componentShouldUpdate = true;
      } catch (error) {
        await commitAddLog(error.message)(logsDispatch);
      }
    }
  }, 1000);

  const onChangeTitle = async (event) => {
    await commitUpdateFeed({
      type: 'program',
      entity: {
        ...props.program,
        ...{ name: event.target.value },
      },
    })(feedDispatch)
    onUpdate();
  };

  const onChangeSlug: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setState({ slug: event.target.value }, onUpdate);
  };

  const onChangePath = async (selected) => {
    await commitUpdateFeed({
      type: 'program',
      entity: {
        ...props.program,
        ...{ path: selected },
      },
    })(feedDispatch)
    onUpdate();
  };

  const onChangeClients = async (clients) => {
    await commitUpdateFeed({
      type: 'program',
      entity: {
        ...props.program,
        ...{ clients: clients },
      },
    })(feedDispatch)
    onUpdate();
  };

  const onChangeTags = async (tags) => {
    await commitUpdateFeed({
      type: 'program',
      entity: {
        ...props.program,
        ...{ tags: tags },
      },
    })(feedDispatch)
    onUpdate();
  };

  const onChangeDescription = async (description) => {
    await commitUpdateFeed({
      type: 'program',
      entity: {
        ...props.program,
        ...{ description: description },
      },
    })(feedDispatch)
    onUpdate();
  };

  const onChangePublic = async (value) => {
    await commitUpdateFeed({
      type: 'program',
      entity: {
        ...props.program,
        ...{ isPublic: value },
      },
    })(feedDispatch)
    onUpdate();
  };

  const onUpdate = debounce(async () => {
    let { program } = props;
    program.slug = state.slug ?? program.slug;

    program = await updateProgram(program, auth.token)(feedDispatch);
    const path = toFeedPath(program, user);
    navigate(path);
  }, 1000);

  const onDuplicate = async (event) => {
    event.preventDefault();

    const program = props.program;
    program.name += ' Copy';

    try {
      const item = await createProgram(program, auth.uid, auth.token)(feedDispatch)
      Object.assign(program, item);
      await setProgramData(program, auth.token)(feedDispatch);
      navigate(toFeedPath(program, user));
    } catch (error) {
      return commitAddLog(error.message)(logsDispatch);
    }
  };

  const onDelete = async (event) => {
    event.preventDefault();

    await deleteProgram(props.program, auth.token)(feedDispatch);
    navigate(toFeedPath(props.program, user, true));
  };

  const onFolderEdit = async (event) => {
    event.preventDefault();

    const { feed } = props;

    const folderTree = await getFolderTree(feed.uid, auth.token)(feedDispatch);
    setState({
      folderTreeEdit: true,
      folderTree: folderTree,
    });
  };

  const getFlows = (program) => {
    const { allFlows } = props;
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

  const getNodeClipboard = () => {
    const { program } = props;

    if (user.apiKey) {
      return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key=${user.apiKey} ${program.slug}`;
    }

    return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key={your-api-key} ${program.slug}`;
  };

  const onCopyNodeUsage: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const clipboard = getNodeClipboard();

    ui.copyTextToClipboard(clipboard);
  };

  const { program, allFlows } = props;
  const { folderTreeEdit, folderTree } = state;
  const programFlows = getFlows(program);
  const clients = {
    uniflow: 'Uniflow',
    node: 'Node',
    vscode: 'VSCode',
  };
  program.slug = state.slug ?? program.slug;

  return (
    <section className="section col">
      <div className="row">
        <div className="col">
          <h3>Infos</h3>
        </div>
        <div className="d-block col-auto">
          <div className="btn-toolbar" role="toolbar" aria-label="flow actions">
            <div className="btn-group-sm" role="group">
              <button type="button" className="btn text-secondary" onClick={onDuplicate}>
                <FontAwesomeIcon icon={faClone} />
              </button>
              <button type="button" className="btn text-secondary" onClick={onDelete}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <form className="form-sm-horizontal">
        <div className="row mb-3">
          <label htmlFor="program-name" className="col-sm-2 col-form-label">
            Title
          </label>

          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="program-name"
              value={program.name}
              onChange={onChangeTitle}
              placeholder="Title"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="program-slug" className="col-sm-2 col-form-label">
            Slug
          </label>

          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="program-slug"
              value={program.slug}
              onChange={onChangeSlug}
              placeholder="Slug"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="program-path" className="col-sm-2 col-form-label">
            Path
          </label>

          <div className="col-sm-10">
            {(folderTreeEdit && (
              <Select
                value={program.path}
                onChange={onChangePath}
                className="form-control"
                id="program-path"
                options={folderTree.map((value) => {
                  return { value: value, label: value };
                })}
              />
            )) || (
              <div>
                <button type="button" className="btn btn-secondary" onClick={onFolderEdit}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>{' '}
                {program.path}
              </div>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="program-clients" className="col-sm-2 col-form-label">
            Clients
          </label>

          <div className="col-sm-10">
            <Select
              value={program.clients}
              onChange={onChangeClients}
              className="form-control"
              id="program-clients"
              multiple={true}
              options={Object.keys(clients).map((value) => {
                return { value: value, label: clients[value] };
              })}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="program-tags" className="col-sm-2 col-form-label">
            Tags
          </label>

          <div className="col-sm-10">
            <Select
              value={program.tags}
              onChange={onChangeTags}
              className="form-control"
              id="program-tags"
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
          <label htmlFor="program-public" className="col-sm-2 col-form-label">
            Public
          </label>

          <div className="col-sm-10">
            <Checkbox
              className="form-control-plaintext"
              value={program.isPublic}
              onChange={onChangePublic}
              id="program-public"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="program-description" className="col-sm-2 col-form-label">
            Description
          </label>

          <div className="col-sm-10">
            <Editor
              className="form-control"
              id="program-description"
              value={program.description}
              onChange={onChangeDescription}
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
                <button className="btn btn-primary" onClick={onRun}>
                  <FontAwesomeIcon icon={faPlay} /> Play
                </button>
              </div>
            </div>
          );
        } else if (client === 'node') {
          const clipboard = getNodeClipboard(user);

          return (
            <div key={`client-${client}`} className="row mb-3">
              <label htmlFor="program-node-api-key" className="col-sm-2 col-form-label">
                Node usage
              </label>
              <div className="col-sm-10">
                <div className="input-group">
                  <button
                    type="button"
                    className="input-group-text"
                    onClick={onCopyNodeUsage}
                  >
                    <FontAwesomeIcon icon={faClipboard} />
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    id="program-node-api-key"
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
        graph={graph}
        allFlows={allFlows}
        programFlows={programFlows}
        clients={program.clients}
        onPush={onPushFlow}
        onPop={onPopFlow}
        onUpdate={onUpdateFlow}
        onRun={onRun}
      />
    </section>
  );
}

export default Program;
