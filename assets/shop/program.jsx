import React from 'react';
import { createRoot } from 'react-dom/client';
import debounce from 'lodash/debounce';
import Flows from './components/flows';
import Api from './services/api';
import Select from './components/select';
import { ClientType } from './models/client-type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClone, faEdit, faPlay } from '@fortawesome/free-solid-svg-icons';

const clients = {
  [ClientType.UNIFLOW]: 'Uniflow',
  [ClientType.PHP]: 'Php',
  [ClientType.NODE]: 'Node',
  [ClientType.VSCODE]: 'VSCode',
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

    // Clear current flows
    this.setState({
      program,
      graph: {
        ...this.state.graph,
        flows: []
      }
    });

    // Fetch program data if needed
    let data = null;
    try {
      const options = {
        token: this.token
      };
      data = await this.api.getProgramFlows(this.uid, options);
    } catch (error) {
      console.error("Error fetching program data:", error);
    }

    if (data) {
      // Deserialize flow data
      const graphData = this.onDeserializeFlowsData(data);
      this.setState({ fetchedFlows: graphData });

      // Add each flow to the graph
      for (let index = 0; index < graphData.length; index++) {
        this.onPushFlow(index, graphData[index].type);
      }
    }
  }, 1000);

  updateProgramFlows = () => {
    const flowLabels = [];
    const keys = Object.keys(this.state.program.clients);

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

    this.setState({
        programFlows: flowLabels
      })

    return flowLabels;
  }

  onPlay = (index) => {
    console.log('Play flows', index !== undefined ? `up to index ${index}` : 'all');
  }

  onPushFlow = (index, flowType) => {
    const { graph } = this.state;
    const flows = [...graph.flows];

    flows.splice(index, 0, { type: flowType, data: {} });

    this.setState({
      graph: {
        ...graph,
        flows
      }
    });
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
    });
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
    });
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

  onDeserializeFlowsData = (data) => {
    let flowsData = [];
    try {
      if (typeof data === 'string') {
        flowsData = JSON.parse(data);
      } else {
        flowsData = data;
      }
    } catch (error) {
      console.error("Error parsing flow data:", error);
    }

    return Array.isArray(flowsData) ? flowsData : [];
  }

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
                <a class="btn btn-primary" className="btn text-secondary" href={`/program/duplicate/${this.uid}`}>
                    <FontAwesomeIcon icon={faClone} />
                </a>
                <a class="btn btn-primary" className="btn text-secondary" href={`/program/remove/${this.uid}`}>
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
