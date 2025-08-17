import React from 'react';
import { createRoot } from 'react-dom/client';
import debounce from 'lodash/debounce';
import Flows from './components/flows';
import Api from './services/api';
import Select from './components/select';
import { ClientType } from './models/client-type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClone, faEdit, faPlay, faClipboard } from '@fortawesome/free-solid-svg-icons';
import Runner from './models/runner';

const clients = {
  [ClientType.UNIFLOW]: 'Uniflow',
  [ClientType.PHP]: 'Php',
  [ClientType.NODE]: 'Node',
  [ClientType.VSCODE]: 'VSCode',
};

const allFlows = {
  '@uniflow-io/uniflow-flow-function': {
    name: 'Function Flow',
    clients: [ClientType.UNIFLOW, ClientType.PHP, ClientType.NODE, ClientType.VSCODE],
  },
  '@uniflow-io/uniflow-flow-prompt': {
    name: 'Prompt Flow',
    clients: [ClientType.UNIFLOW],
  },
  '@uniflow-io/uniflow-flow-text': {
    name: 'Text Flow',
    clients: [ClientType.UNIFLOW, ClientType.PHP, ClientType.NODE, ClientType.VSCODE],
  },
  '@uniflow-io/uniflow-flow-assets': {
    name: 'Assets Flow',
    clients: [ClientType.UNIFLOW],
  },
  '@uniflow-io/uniflow-flow-canvas': {
    name: 'Canvas Flow',
    clients: [ClientType.UNIFLOW],
  },
  '@uniflow-io/uniflow-flow-object': {
    name: 'Object Flow',
    clients: [ClientType.UNIFLOW, ClientType.PHP, ClientType.NODE, ClientType.VSCODE],
  }
};

class Program extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folderTreeEdit: false,
      folderTree: [],
      errors: {},
      programFlows: [],
      program: {
        name: '',
        slug: '',
        path: '',
        clients: [],
        tags: [],
        isPublic: false,
        description: '',
        uid: ''
      },
      graph: {
        flows: []
      }
    };

    this.flowsRef = React.createRef();
    this.uid = '';
  }

  componentDidMount() {
    // Get program data from the container
    const programContainer = document.getElementById('program');
    if (programContainer) {
      const uid = programContainer.dataset.uid;
      const token = programContainer.dataset.token;
      const apiHost = programContainer.dataset.apiHost;

      this.uid = uid;
      this.token = token;
      this.api = new Api(apiHost);

      this.onFetchProgram();
      this.onFetchFlowData();
    }
  }

  onFetchProgram = async () => {
    const options = {
        token: this.token
    };
    const program = await this.api.getProgram(this.uid, options);
    program.description = program.description || '';

    this.setState({
        program
    }, () => {
      this.updateProgramFlows();
    });
  }

  updateProgram = debounce(async () => {
    const options = {
      token: this.token
    };
    const { program } = this.state;

    const programData = {
      name: program.name,
      slug: program.slug,
      clients: program.clients,
      tags: program.tags,
      public: program.isPublic,
      description: program.description
    };

    return await this.api.updateProgram(this.uid, programData, options);
  }, 1000);

  onFetchFlowData = debounce(async () => {
    const program = {
      ...this.state.program,
      uid: this.uid,
    };

    this.setState({
      program,
      graph: {
        ...this.state.graph,
        flows: []
      }
    });

    let data = null;
    const options = {
        token: this.token
    };
    data = await this.api.getProgramFlows(this.uid, options);

    if (data) {
      this.onDeserializeFlowsData(data);
    }
  }, 1000);

  updateProgramFlows = () => {
    const flowLabels = [];

    // Check if program and clients exist
    if (!this.state.program || !this.state.program.clients) {
      this.setState({ programFlows: flowLabels });
      return flowLabels;
    }

    // Iterate over available flows instead of program clients
    const flowKeys = Object.keys(allFlows);

    for (let i = 0; i < flowKeys.length; i++) {
      const flowKey = flowKeys[i];
      const flow = allFlows[flowKey];

      // Check if the flow supports any of the program's clients
      const canPushFlow = this.state.program.clients.some(client =>
        flow.clients.indexOf(client) !== -1
      );

      if (canPushFlow) {
        flowLabels.push({
          key: flowKey,
          label: flow.name,
        });
      }
    }

    flowLabels.sort(function (flow1, flow2) {
      const x = flow1.label;
      const y = flow2.label;
      return x < y ? -1 : x > y ? 1 : 0;
    });

    this.setState({
        programFlows: flowLabels
      })

    return flowLabels;
  }

  onSerializeFlowsData = (flows) => {
    const data = [];

    for (let index = 0; index < flows.length; index++) {
      const flow = flows[index]
      data.push({
        flow: flow.type,
        data: this.flowsRef.current.onSerialize(index),
      });
    }

    return data;
  }

  onDeserializeFlowsData = (data) => {
    data = Array.isArray(data) ? data : [];

    let flows = []
    for (let index = 0; index < data.length; index++) {
        const flow = data[index]
        flows.splice(index, 0, { type: flow.flow, data: {} });
    }

    const { graph } = this.state;
    this.setState({
      graph: {
        ...graph,
        flows
      }
    }, () => {
      // Store the data to deserialize for later use
      this.pendingDeserialization = data;
    });
  }

  onDeserializePendingFlows = () => {
    if (!this.pendingDeserialization || !this.flowsRef.current) {
      return;
    }

    const data = this.pendingDeserialization;
    const updatedFlows = [...this.state.graph.flows];

    for (let index = 0; index < data.length; index++) {
      const flow = data[index];
      const deserializedData = this.flowsRef.current.onDeserialize(index, flow.data);

      updatedFlows[index] = {
        ...updatedFlows[index],
        data: deserializedData
      };
    }

    this.setState({
      graph: {
        ...this.state.graph,
        flows: updatedFlows
      }
    });

    // Clear the pending deserialization
    this.pendingDeserialization = null;
  }

  onUpdateFlowData = debounce(async () => {
    //const programRef = getProgramRef();

    const { graph } = this.state;
    if (graph && graph.flows) {
      const data = this.onSerializeFlowsData(graph.flows);

      if(this.token) {
        const options = {
            token: this.token
        };
        await this.api.updateProgramFlows(this.uid, data, options);
      }
    }
  }, 1000)

  onPlay = async (index) => {
    const { graph } = this.state;
    const runner = new Runner();
    await runner.run(graph.flows.slice(0, index === undefined ? graph.flows.length : index + 1), this.flowsRef);
  };


  onPushFlow = (index, flowType) => {
    const { graph } = this.state;
    const flows = [...graph.flows];

    flows.splice(index, 0, { type: flowType, data: {} });

    this.setState({
      graph: {
        ...graph,
        flows
      }
    }, this.onUpdateFlowData);
  }

  onPopFlow = (index) => {
    const { graph } = this.state;
    const flows = [...graph.flows];

    flows.splice(index, 1);

    this.setState({
      graph: {
        ...graph,
        flows
      }
    }, this.onUpdateFlowData);
  }

  onUpdateFlow = (index, data) => {
    const { graph } = this.state;
    const flows = [...graph.flows];

    flows[index] = {
      ...flows[index],
      data
    };

    this.setState({
      graph: {
        ...graph,
        flows
      }
    }, this.onUpdateFlowData);
  }

  onChangeName = (name) => {
    this.setState({
      program: {
        ...this.state.program,
        name
      }
    }, this.updateProgram);
  }

  onChangeSlug = (slug) => {
    this.setState({
      program: {
        ...this.state.program,
        slug
      }
    }, this.updateProgram);
  }

  onChangePath = (path) => {
    this.setState({
      program: {
        ...this.state.program,
        path
      }
    }, this.updateProgram);
  }

  onChangeClients = (clients) => {
    this.setState({
      program: {
        ...this.state.program,
        clients
      }
    }, () => {
        this.updateProgramFlows()
        this.updateProgram()
    });
  }

  onChangeTags = (tags) => {
    this.setState({
      program: {
        ...this.state.program,
        tags
      }
    }, this.updateProgram);
  }

  onChangeDescription = (description) => {
    this.setState({
      program: {
        ...this.state.program,
        description
      }
    }, this.updateProgram);
  }

  onChangePublic = (isPublic) => {
    this.setState({
      program: {
        ...this.state.program,
        isPublic
      }
    }, this.updateProgram);
  }

  onDuplicate = (event) => {
    event.preventDefault();
    console.log('Duplicate program');
  }

  onDelete = (event) => {
    event.preventDefault();
    console.log('Delete program');
  }

  onFolderEdit = (event) => {
    event.preventDefault();

    this.setState({
      folderTreeEdit: true,
      folderTree: ['/', '/path1', '/path2']
    });
  }

  getPhpClipboard = () => {
    /*if (user.apiKey) {
      return `php -e "$(curl -s https://uniflow.io/assets/php.php)" bin/console app:client --api-key=${user.apiKey} ${program.slug}`;
    }*/

    return `php -e "$(curl -s https://uniflow.io/assets/php.php)" bin/console app:client --api-key={your-api-key} ${program.slug}`;
  };

  getNodeClipboard = () => {
    /*if (user.apiKey) {
      return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key=${user.apiKey} ${program.slug}`;
    }*/

    return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key={your-api-key} ${program.slug}`;
  };

  onCopyPhpUsage = (event) => {
    event.preventDefault();

    const clipboard = getPhpClipboard();
    ui.copyTextToClipboard(clipboard);
  };

  onCopyNodeUsage = (event) => {
    event.preventDefault();

    const clipboard = getNodeClipboard();
    ui.copyTextToClipboard(clipboard);
  };

  render() {
    const { program } = this.state;

    return (
      <div className="program-container">
        <div className="row">
          <div className="col">
            <h3>Infos</h3>
          </div>
          <div className="d-block col-auto">
            <div className="btn-toolbar" role="toolbar" aria-label="flow actions">
              <div className="btn-group-sm" role="group">
                <a className="btn text-secondary" href={`/program/duplicate/${this.uid}`}>
                    <FontAwesomeIcon icon={faClone} />
                </a>
                <a className="btn text-secondary" href={`/program/remove/${this.uid}`}>
                    <FontAwesomeIcon icon={faTimes} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <form className="form-sm-horizontal">
          <div className="row mb-3">
            <label htmlFor="program-name" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="program-name"
                value={program.name}
                onChange={(e) => this.onChangeName(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="program-slug" className="col-sm-2 col-form-label">Slug</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="program-slug"
                value={program.slug}
                onChange={(e) => this.onChangeSlug(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="program-clients" className="col-sm-2 col-form-label">Clients</label>
            <div className="col-sm-10">
              <Select
                id="program-clients"
                value={program.clients}
                onChange={this.onChangeClients}
                multiple={true}
                options={Object.keys(clients).map((client) => {
                  return { value: client, label: clients[client] };
                })}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="program-tags" className="col-sm-2 col-form-label">Tags</label>
            <div className="col-sm-10">
              <Select
                id="program-tags"
                value={program.tags}
                onChange={this.onChangeTags}
                multiple={true}
                edit={true}
                options={this.state.program.tags.map((tag) => {
                  return { value: tag, label: tag };
                })}
              />
            </div>
          </div>
          {/*
          <div className="row mb-3">
            <label htmlFor="program-path" className="col-sm-2 col-form-label">Path</label>
            <div className="col-sm-10">
              {this.state.folderTreeEdit ? (
                <select
                  value={program.path}
                  onChange={(e) => this.onChangePath(e.target.value)}
                  className="form-control"
                  id="program-path"
                >
                  {this.state.folderTree.map((path, index) => (
                    <option key={index} value={path}>{path}</option>
                  ))}
                </select>
              ) : (
                <div>
                  <button type="button" className="btn btn-secondary" onClick={this.onFolderEdit}>
                    Edit
                  </button>{' '}
                  {program.path}
                </div>
              )}
            </div>
          </div>
          */}
          <div className="row mb-3">
            <label htmlFor="program-description" className="col-sm-2 col-form-label">Description</label>
            <div className="col-sm-10">
              <textarea
                className="form-control"
                id="program-description"
                value={program.description}
                onChange={(e) => this.onChangeDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="program-public" className="col-sm-2 col-form-label">Public</label>
            <div className="col-sm-10">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="program-public"
                  checked={program.isPublic}
                  onChange={(e) => this.onChangePublic(e.target.checked)}
                />
              </div>
            </div>
          </div>
        </form>
        {program.clients.map((client) => {
            if (client === ClientType.UNIFLOW) {
            return (
                <div key={`client-${client}`} className="row mb-3">
                    <div className="col-sm-10 offset-sm-2">
                        <button
                        className="btn btn-primary"
                        onClick={(event) => {
                            event.preventDefault();
                            this.onPlay();
                        }}
                        >
                        <FontAwesomeIcon icon={faPlay} /> Play
                        </button>
                    </div>
                </div>
            );
            } else if (client === ClientType.PHP) {
                const clipboard = this.getPhpClipboard();

                return (
                <div key={`client-${client}`} className="row mb-3">
                    <label htmlFor="program-php-api-key" className="col-sm-2 col-form-label">PHP usage</label>
                    <div className="col-sm-10">
                        <div className="input-group">
                            <button type="button" className="input-group-text" onClick={this.onCopyPhpUsage}>
                                <FontAwesomeIcon icon={faClipboard} />
                            </button>
                            <input
                                type="text"
                                className="form-control"
                                id="program-php-api-key"
                                value={clipboard || ''}
                                readOnly
                                placeholder="api key"
                            />
                        </div>
                    </div>
                </div>
                );
            } else if (client === ClientType.NODE) {
            const clipboard = this.getNodeClipboard();

            return (
                <div key={`client-${client}`} className="row mb-3">
                <label htmlFor="program-node-api-key" className="col-sm-2 col-form-label">Node usage</label>
                <div className="col-sm-10">
                    <div className="input-group">
                    <button type="button" className="input-group-text" onClick={this.onCopyNodeUsage}>
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
          ref={this.flowsRef}
          clients={this.state.program.clients}
          graph={this.state.graph}
          programFlows={this.state.programFlows}
          onPush={this.onPushFlow}
          onPop={this.onPopFlow}
          onUpdate={this.onUpdateFlow}
          onPlay={this.onPlay}
          onDeserializeReady={this.onDeserializePendingFlows}
        />
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const programContainer = document.getElementById('program');
  if (programContainer) {
    const root = createRoot(programContainer);
    root.render(React.createElement(Program));
  }
});
