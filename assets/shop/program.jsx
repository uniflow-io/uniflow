import React from 'react';
import { createRoot } from 'react-dom/client';
import debounce from 'lodash/debounce';
import Flows from './components/flows';
import Api from './services/api';
import Select from './components/select';
import { ClientType } from './models/client-type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClone, faPlay, faClipboard } from '@fortawesome/free-solid-svg-icons';
import Runner from './models/runner';
import { flows, flowsNames, flowsClients } from './models/flows'

class Program extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folderTreeEdit: false,
      folderTree: [],
      errors: {},
      programFlows: [],
      isPlaying: false,
      user: {
        apiKey: null
      },
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
      this.onFetchUserSettings();
    }
  }

  onFetchUserSettings = async () => {
    if (this.token) {
      try {
        const options = {
          token: this.token
        };
        const userSettings = await this.api.getUserSettings(this.uid, options);

        this.setState({
          user: {
            apiKey: userSettings.apiKey
          }
        });
      } catch (error) {
        console.error('Failed to fetch user settings:', error);
      }
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

    if(this.token) {
        await this.api.updateProgram(this.uid, programData, options);
    }
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

  onUpdateProgramFlows = () => {
    let clients = [
        ClientType.UNIFLOW,
        ClientType.PHP,
        ClientType.NODE,
        ClientType.VSCODE,
    ];
    let flowLabels = [];
    Object.keys(flows).forEach((key) => {
        flowLabels.push({
            key: key,
            label: flowsNames[key],
        })
    })

    this.state.graph.flows.forEach((flow, index) => {
        if (flow.type && flowsClients[flow.type]) {
            const flowClients = flowsClients[flow.type];

            clients = clients.filter(client => flowClients.includes(client));

            flowLabels = flowLabels.filter(flowLabel => {
                const flowSupportedClients = flowsClients[flowLabel.key];
                return flowSupportedClients && flowSupportedClients.some(client => clients.includes(client));
            });
        }
    });

    flowLabels.sort(function (flow1, flow2) {
      const x = flow1.label;
      const y = flow2.label;
      return x < y ? -1 : x > y ? 1 : 0;
    });

    this.setState({
        program: {
            ...this.state.program,
            clients
        },
        programFlows: flowLabels,
    })
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
        flows.splice(index, 0, { type: flow.flow, data: {}, isPlaying: false });
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
        data: deserializedData,
        isPlaying: false // Initialize isPlaying to false
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
    // Set playing state to true
    this.setState({ isPlaying: true });

    const { graph } = this.state;
    const runner = new Runner();

    // Create a callback to update flow playing state
    const onFlowStateChange = (flowIndex, isPlaying) => {
      this.setState(prevState => ({
        graph: {
          ...prevState.graph,
          flows: prevState.graph.flows.map((flow, i) =>
            i === flowIndex ? { ...flow, isPlaying } : flow
          )
        }
      }));
    };

    // If index is provided, play from that flow to the end
    // If no index, play all flows from the beginning
    const flowsToExecute = index !== undefined ? graph.flows.slice(index) : graph.flows;

    await runner.run(
        flowsToExecute,
        this.flowsRef,
        onFlowStateChange
    );
    this.setState({ isPlaying: false });
  };

  onStop = () => {
    // Reset all flow states to not playing
    this.setState(prevState => ({
      isPlaying: false,
      graph: {
        ...prevState.graph,
        flows: prevState.graph.flows.map(flow => ({ ...flow, isPlaying: false }))
      }
    }));
  };

  onStopFlow = (flowIndex) => {
    // Stop a specific flow and reset global playing state
    this.setState(prevState => ({
      isPlaying: false,
      graph: {
        ...prevState.graph,
        flows: prevState.graph.flows.map((flow, i) =>
          i === flowIndex ? { ...flow, isPlaying: false } : flow
        )
      }
    }));
  };

  onPushFlow = (index, flowType) => {
    const { graph } = this.state;
    const flows = [...graph.flows];

    flows.splice(index, 0, { type: flowType, data: {}, isPlaying: false });

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
    /*this.setState({
      program: {
        ...this.state.program,
        clients
      }
    }, () => {
        this.updateProgramFlows()
        this.updateProgram()
    });*/
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
    if (this.state.user.apiKey) {
      return `php -e "$(curl -s https://uniflow.io/assets/php.php)" bin/console app:client --api-key=${this.state.user.apiKey} ${this.state.program.slug}`;
    }

    return `php -e "$(curl -s https://uniflow.io/assets/php.php)" bin/console app:client --api-key={your-api-key} ${this.state.program.slug}`;
  };

  getNodeClipboard = () => {
    if (this.state.user.apiKey) {
      return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key=${this.state.user.apiKey} ${this.state.program.slug}`;
    }

    return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key={your-api-key} ${this.state.program.slug}`;
  };

  onCopyPhpUsage = (event) => {
    event.preventDefault();

    const clipboard = this.getPhpClipboard();
    navigator.clipboard.writeText(clipboard).then(() => {
      // Show feedback
      const button = event.target;
      const originalText = button.innerHTML;
      button.innerHTML = '✓';
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1000);
    }).catch((err) => {
      console.error('Failed to copy to clipboard:', err);
    });
  };

  onCopyNodeUsage = (event) => {
    event.preventDefault();

    const clipboard = this.getNodeClipboard();
    navigator.clipboard.writeText(clipboard).then(() => {
      // Show feedback
      const button = event.target;
      const originalText = button.innerHTML;
      button.innerHTML = '✓';
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1000);
    }).catch((err) => {
      console.error('Failed to copy to clipboard:', err);
    });
  };

  render() {
    const { program } = this.state;

    return (
      <div className="program-container">
        <div className="row">
          <div className="col">
            <h3>Infos</h3>
          </div>
          {/*<div className="d-block col-auto">
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
          </div>*/}
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
                options={[
                  { value: ClientType.UNIFLOW, label: 'Uniflow' },
                  { value: ClientType.PHP, label: 'PHP' },
                  { value: ClientType.NODE, label: 'Node' },
                  { value: ClientType.VSCODE, label: 'VSCode' }
                ]}
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
                        {!this.state.isPlaying ? (
                            <button
                            className="btn btn-primary"
                            onClick={(event) => {
                                event.preventDefault();
                                this.onPlay();
                            }}
                            >
                            <FontAwesomeIcon icon={faPlay} /> Play
                            </button>
                        ) : (
                            <button
                            className="btn btn-secondary"
                            onClick={(event) => {
                                event.preventDefault();
                                this.onStop();
                            }}
                            >
                            <FontAwesomeIcon icon={faTimes} /> Stop
                            </button>
                        )}
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
          onStop={this.onStop}
          onStopFlow={this.onStopFlow}
          onDeserializeReady={() => {
            this.onDeserializePendingFlows()
            this.onUpdateProgramFlows()
          }}
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
