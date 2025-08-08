import React from 'react';
import { createRoot } from 'react-dom/client';
import debounce from 'lodash/debounce';
import Flows from './components/flows';
import Api from './services/api';

class Program extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folderTreeEdit: false,
      folderTree: [],
      errors: {},
      fetchedFlows: [],
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

    // Create debounced update function
    this.debouncedUpdateProgram = debounce(this.updateProgram, 1000);

    // Bind methods
    this.onPushFlow = this.onPushFlow.bind(this);
    this.onPopFlow = this.onPopFlow.bind(this);
    this.onUpdateFlow = this.onUpdateFlow.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeSlug = this.onChangeSlug.bind(this);
    this.onChangePath = this.onChangePath.bind(this);
    this.onChangeClients = this.onChangeClients.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangePublic = this.onChangePublic.bind(this);
    this.onDuplicate = this.onDuplicate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onFolderEdit = this.onFolderEdit.bind(this);
    this.updateProgram = this.updateProgram.bind(this);
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

  async onFetchProgram() {
    const options = {
        token: this.token
    };
    const program = await this.api.getProgram(this.uid, options);
    program.description = program.description || '';

    this.setState({ program });
  }

  async updateProgram() {
    const options = {
      token: this.token
    };
    const { program } = this.state;

    const programData = {
      name: program.name,
      slug: program.slug,
      clients: program.clients,
      tags: program.tags,
      description: program.description
    };

    return await this.api.updateProgram(this.uid, programData, options);
  }

  onFetchFlowData() {
    const program = {
      ...this.state.program,
      uid: this.uid,
    };

    this.setState({ program });
  }

  onPlay(index) {
    console.log('Play flows', index !== undefined ? `up to index ${index}` : 'all');
  }

  onPushFlow(index, flowType) {
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

  onPopFlow(index) {
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

  onUpdateFlow(index, data) {
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

  onChangeName(name) {
    this.setState({
      program: {
        ...this.state.program,
        name
      }
    }, () => {
      this.debouncedUpdateProgram();
    });
  }

  onChangeSlug(slug) {
    this.setState({
      program: {
        ...this.state.program,
        slug
      }
    }, () => {
      this.debouncedUpdateProgram();
    });
  }

  onChangePath(path) {
    this.setState({
      program: {
        ...this.state.program,
        path
      }
    }, () => {
      this.debouncedUpdateProgram();
    });
  }

  onChangeClients(clients) {
    this.setState({
      program: {
        ...this.state.program,
        clients
      }
    }, () => {
      this.debouncedUpdateProgram();
    });
  }

  onChangeTags(tags) {
    this.setState({
      program: {
        ...this.state.program,
        tags
      }
    }, () => {
      this.debouncedUpdateProgram();
    });
  }

  onChangeDescription(description) {
    this.setState({
      program: {
        ...this.state.program,
        description
      }
    }, () => {
      this.debouncedUpdateProgram();
    });
  }

  onChangePublic(isPublic) {
    this.setState({
      program: {
        ...this.state.program,
        isPublic
      }
    }, () => {
      this.debouncedUpdateProgram();
    });
  }

  onDuplicate(event) {
    event.preventDefault();
    console.log('Duplicate program');
  }

  onDelete(event) {
    event.preventDefault();
    console.log('Delete program');
  }

  onFolderEdit(event) {
    event.preventDefault();

    this.setState({
      folderTreeEdit: true,
      folderTree: ['/', '/path1', '/path2']
    });
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
                <button type="button" className="btn text-secondary" onClick={this.onDuplicate}>
                  Clone
                </button>
                <button type="button" className="btn text-secondary" onClick={this.onDelete}>
                  Delete
                </button>
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
        </form>
        <hr />
        <Flows
          ref={this.flowsRef}
          clients={this.state.program.clients}
          graph={this.state.graph}
          programFlows={this.state.fetchedFlows}
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
