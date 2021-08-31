import React, { useState, useEffect, useMemo, createRef } from 'react';
import { navigate } from 'gatsby';
import debounce from 'lodash/debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClone, faEdit, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { Flows, Select } from '../../components';
import Runner, { ClientType } from '../../models/runner';
import {
  commitPushFlow,
  commitPopFlow,
  commitUpdateFlow,
  commitSetFlows,
  GraphProviderState,
  GraphProviderProps,
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
  useFeed,
  ProgramFeedType,
  getFeedItem,
} from '../../contexts/feed';
import { commitAddLog, useLogs } from '../../contexts/logs';
import Container from '../../container';
import { UI } from '../../services';
import { useAuth, useGraph, useUser } from '../../contexts';
import { PathType } from '../../models/type-interfaces';
import {
ApiValidateException,  ApiValidateExceptionErrors,
} from '../../models/api-exceptions';
import FormInput, { FormInputType } from '../../components/form-input';
import { useLocation } from '@reach/router';
import Alert, { AlertType } from '../../components/alert';
import { FlowMetadata } from '../../components/flow/flow';
import { FC } from 'react';
import { FlowsHandle } from '../../components/flows';
import { useRef } from 'react';

const container = new Container();
const ui = container.get(UI);

type DeserialisedFlows = {
  type: string
  data?: string
}[]

export interface ProgramProps {
  allFlows: { [key: string]: FlowMetadata };
  program: ProgramFeedType;
}

export interface ProgramState {}

const Program: FC<ProgramProps> = (props) => {
  const [folderTreeEdit, setFolderTreeEdit] = useState<boolean>(false);
  const [folderTree, setFolderTree] = useState<PathType[]>([]);
  const [errors, setErrors] = useState<
    ApiValidateExceptionErrors<
      'form' | 'name' | 'slug' | 'path' | 'clients' | 'tags' | 'isPublic' | 'description'
    >
  >({});
  const { logsDispatch } = useLogs();
  const { auth, authDispatch } = useAuth();
  const { user, userDispatch } = useUser();
  const { feed, feedDispatch, feedRef } = useFeed();
  const { graph, graphDispatch, graphRef } = useGraph();
  const [ fetchedFlows, setFetchedFlows ] = useState<DeserialisedFlows>([])
  const flowsRef = useRef<FlowsHandle>(null)
  const location = useLocation();
  const { program, allFlows } = props;
  const clients: { [key in ClientType]: string } = {
    [ClientType.UNIFLOW]: 'Uniflow',
    [ClientType.NODE]: 'Node',
    [ClientType.VSCODE]: 'VSCode',
  };

  const getProgramRef = (): ProgramFeedType => {
    return getFeedItem(feedRef.current)!.entity as ProgramFeedType;
  };

  const getFlows = (program: ProgramFeedType) => {
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

  const programFlows = getFlows(program);
  const tags = getTags(feed);

  useEffect(() => {
    setFolderTreeEdit(false);
    setFolderTree([props.program.path]);
    onFetchFlowData()

    return () => {
      onFetchFlowData.cancel();
      onUpdate.cancel();
      onUpdateFlowData.cancel();
    };
  }, [props.program.uid]);

  const onPlay = async (index?: number) => {
    const runner = new Runner();
    await runner.run(graph.flows.slice(0, index === undefined ? graph.flows.length : index + 1), flowsRef, graphDispatch);
  };

  const onPushFlow = (index: number, flowType: string) => {
    commitPushFlow(index, flowType)(graphDispatch);
    onUpdateFlowData();
  };

  const onPopFlow = (index: number) => {
    commitPopFlow(index)(graphDispatch);
    onUpdateFlowData();
  };

  const onUpdateFlow = (index: number, data: object) => {
    commitUpdateFlow(index, data)(graphDispatch);
    onUpdateFlowData();
  };

  useEffect(() => {
    for (let index = 0; index < graph.flows.length; index++) {
      const flow = graph.flows[index]
      if(flow.data === undefined && flowsRef.current) {
        const data = flowsRef.current.onDeserialize(index, fetchedFlows[index]?.data)
        onUpdateFlow(index, data);
      }
    }

  }, [graph.flows.length])

  const onChangeName = async (name: string) => {
    commitUpdateFeed({
      type: 'program',
      entity: {
        ...props.program,
        ...{ name },
      },
    })(feedDispatch);
    onUpdate();
  };

  const onChangeSlug = (slug: string) => {
    commitUpdateFeed({
      type: 'program',
      entity: {
        ...props.program,
        ...{ slug },
      },
    })(feedDispatch);
    onUpdate();
  };

  const onChangePath = async (path: string) => {
    commitUpdateFeed({
      type: 'program',
      entity: {
        ...props.program,
        ...{ path },
      },
    })(feedDispatch);
    onUpdate();
  };

  const onChangeClients = async (clients: string[]) => {
    commitUpdateFeed({
      type: 'program',
      entity: {
        ...props.program,
        ...{ clients },
      },
    })(feedDispatch);
    onUpdate();
  };

  const onChangeTags = async (tags: string[]) => {
    commitUpdateFeed({
      type: 'program',
      entity: {
        ...props.program,
        ...{ tags },
      },
    })(feedDispatch);
    onUpdate();
  };

  const onChangeDescription = async (description: string) => {
    commitUpdateFeed({
      type: 'program',
      entity: {
        ...props.program,
        ...{ description },
      },
    })(feedDispatch);
    onUpdate();
  };

  const onChangePublic = async (isPublic: boolean) => {
    commitUpdateFeed({
      type: 'program',
      entity: {
        ...props.program,
        ...{ isPublic },
      },
    })(feedDispatch);
    onUpdate();
  };

  const onSerializeFlowsData = (flows: GraphProviderState['flows']): string => {
    const data = [];

    for (let index = 0; index < flows.length; index++) {
      const flow = flows[index]
      data.push({
        flow: flow.type,
        data: flowsRef.current?.onSerialize(index),
      });
    }

    return JSON.stringify(data);
  };

  const onDeserializeFlowsData = (raw: string): DeserialisedFlows => {
    const data = JSON.parse(raw);

    const graph = [];

    for (let index = 0; index < data.length; index++) {
      graph.push({
        type: data[index].flow,
        data: data[index].data,
      });
    }

    return graph;
  };

  const onFetchFlowData = useMemo(
    () =>
      debounce(async () => {
        const programRef = getProgramRef();

        commitSetFlows([])(graphDispatch);
        let data = programRef.data;
        if (!data && auth.token) {
          data = await getProgramData(programRef, auth.token)(
            feedDispatch,
            userDispatch,
            authDispatch
          ) || null;
        }
        if (data) {
          programRef.data = data;
          const graphData = onDeserializeFlowsData(data);
          setFetchedFlows(graphData)
          for (let index = 0; index < graphData.length; index++) {
            onPushFlow(index, graphData[index].type)
          }
        }
      }, 1000),
    [props.program.uid]
  );

  const onUpdateFlowData = useMemo(
    () =>
      debounce(async () => {
        const programRef = getProgramRef();

        const data = onSerializeFlowsData(graphRef.current.flows);
        if (
          auth.token &&
          (feedRef.current.uid === 'me' || user.uid === feedRef.current.uid) &&
          programRef.data !== data
        ) {
          programRef.data = data;

          try {
            await setProgramData(programRef, auth.token)(feedDispatch, userDispatch, authDispatch);
          } catch (error) {
            commitAddLog(error.message)(logsDispatch);
          }
        }
      }, 1000),
    [props.program.uid]
  );

  const onUpdate = useMemo(
    () =>
      debounce(async () => {
        if (auth.token) {
          try {
            setErrors({});
            await updateProgram(getProgramRef(), auth.token)(
              feedDispatch,
              userDispatch,
              authDispatch
            );
            const path = toFeedPath(getProgramRef(), user);
            if (getProgramRef().slug && path !== location.pathname) {
              navigate(path);
            }
          } catch (error) {
            if (error instanceof ApiValidateException) {
              setErrors({ ...error.errors });
            } else {
              setErrors({ form: [error.message] });
            }
          }
        }
      }, 1000),
    [props.program.uid]
  );

  const onDuplicate: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    if (auth.token && auth.uid) {
      program.name += ' Copy';

      try {
        const item = createProgram(program, auth.uid, auth.token)(
          feedDispatch,
          userDispatch,
          authDispatch
        );
        Object.assign(program, item);
        await setProgramData(program, auth.token)(feedDispatch, userDispatch, authDispatch);
        navigate(toFeedPath(program, user));
      } catch (error) {
        commitAddLog(error.message)(logsDispatch);
      }
    }
  };

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    if (auth.token) {
      await deleteProgram(props.program, auth.token)(feedDispatch, userDispatch, authDispatch);
      navigate(toFeedPath(props.program, user, true));
    }
  };

  const onFolderEdit: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    if (feed.uid) {
      const folderTree = await getFolderTree(feed.uid, auth.token)(
        feedDispatch,
        userDispatch,
        authDispatch
      ) || [];
      setFolderTreeEdit(true);
      setFolderTree(folderTree);
    }
  };

  const getNodeClipboard = () => {
    if (user.apiKey) {
      return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key=${user.apiKey} ${program.slug}`;
    }

    return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key={your-api-key} ${program.slug}`;
  };

  const onCopyNodeUsage: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    const clipboard = getNodeClipboard();
    ui.copyTextToClipboard(clipboard);
  };

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
        {errors.form &&
          errors.form.map((message, i) => (
            <Alert key={i} type={AlertType.DANGER}>
              {message}
            </Alert>
          ))}
        <FormInput
          id="program-name"
          type={FormInputType.TEXT}
          label="Name"
          value={program.name}
          errors={errors.name}
          onChange={onChangeName}
        />
        <FormInput
          id="program-slug"
          type={FormInputType.TEXT}
          label="Slug"
          value={program.slug}
          errors={errors.slug}
          onChange={onChangeSlug}
        />
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
        <FormInput
          id="program-clients"
          type={FormInputType.SELECT}
          label="Clients"
          value={program.clients}
          errors={errors.clients}
          onChange={onChangeClients}
          multiple={true}
          options={Object.keys(clients).map((value) => {
            return { value: value, label: clients[value] };
          })}
        />
        <FormInput
          id="program-tags"
          type={FormInputType.SELECT}
          label="Tags"
          value={program.tags}
          errors={errors.tags}
          onChange={onChangeTags}
          multiple={true}
          options={tags.map((tag) => {
            return { value: tag, label: tag };
          })}
        />
        <FormInput
          id="program-public"
          type={FormInputType.CHECKBOX}
          label="Public"
          value={program.isPublic}
          errors={errors.isPublic}
          onChange={onChangePublic}
        />
        <FormInput
          id="program-description"
          type={FormInputType.EDITOR}
          label="Description"
          value={program.description}
          errors={errors.description}
          onChange={onChangeDescription}
        />
      </form>
      {program.clients.map((client) => {
        if (client === 'uniflow') {
          return (
            <div key={`client-${client}`} className="row">
              <div className="col">
                <button
                  className="btn btn-primary"
                  onClick={(event) => {
                    event.preventDefault();
                    onPlay();
                  }}
                >
                  <FontAwesomeIcon icon={faPlay} /> Play
                </button>
              </div>
            </div>
          );
        } else if (client === 'node') {
          const clipboard = getNodeClipboard();

          return (
            <div key={`client-${client}`} className="row mb-3">
              <label htmlFor="program-node-api-key" className="col-sm-2 col-form-label">
                Node usage
              </label>
              <div className="col-sm-10">
                <div className="input-group">
                  <button type="button" className="input-group-text" onClick={onCopyNodeUsage}>
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
        ref={flowsRef}
        clients={program.clients}
        graph={graph}
        programFlows={programFlows}
        onPush={onPushFlow}
        onPop={onPopFlow}
        onUpdate={onUpdateFlow}
        onPlay={onPlay}
      />
    </section>
  );
};

export default Program;
