/**
 * Vanilla JS implementation of flows component
 */

//import FunctionFlow from '../../../library/uniflow-flow-function/src';
//import PromptFlow from '../../../library/uniflow-flow-prompt/src';
//import AssetsFlow from '../../../library/uniflow-flow-assets/src';
//import TextFlow from '../../../library/uniflow-flow-text/src';
//import CanvasFlow from '../../../library/uniflow-flow-canvas/src';
//import ObjectFlow from '../../../library/uniflow-flow-object/src';

const flowImports = {
  '@uniflow-io/uniflow-flow-function': FunctionFlow,
  '@uniflow-io/uniflow-flow-prompt': PromptFlow,
  '@uniflow-io/uniflow-flow-text': TextFlow,
  '@uniflow-io/uniflow-flow-assets': AssetsFlow,
  '@uniflow-io/uniflow-flow-canvas': CanvasFlow,
  '@uniflow-io/uniflow-flow-object': ObjectFlow,
};

class Flows {
  constructor(container, options) {
    this.container = container;
    this.graph = options.graph;
    this.programFlows = options.programFlows || [];
    this.clients = options.clients || [];
    this.onPush = options.onPush || function() {};
    this.onPop = options.onPop || function() {};
    this.onUpdate = options.onUpdate || function() {};
    this.onPlay = options.onPlay || function() {};

    this.flowRefs = [];
    this.render();
  }

  onSerialize(index) {
    if (this.flowRefs[index]) {
      return this.flowRefs[index].onSerialize();
    }
    return undefined;
  }

  onDeserialize(index, data) {
    if (this.flowRefs[index]) {
      return this.flowRefs[index].onDeserialize(data);
    }
    return {};
  }

  onCompile(index, client) {
    if (this.flowRefs[index]) {
      return this.flowRefs[index].onCompile(client);
    }
    return '';
  }

  async onExecute(index, runner) {
    if (this.flowRefs[index]) {
      return await this.flowRefs[index].onExecute(runner);
    }
  }

  render() {
    // Clear container
    this.container.innerHTML = '';
    this.flowRefs = Array(this.graph.flows.length).fill(null);

    // Initial search component
    const initialSearch = new Search(this.programFlows, (flowType) => {
      this.onPush(0, flowType);
    });
    this.container.appendChild(initialSearch.element);

    // Render each flow with a search component after it
    this.graph.flows.forEach((flow, index) => {
      const FlowComponent = flowImports[flow.type];
      if (!FlowComponent) return;

      const flowInstance = new FlowComponent({
        clients: this.clients,
        isPlaying: flow.isPlaying,
        data: flow.data,
        onPop: () => this.onPop(index),
        onUpdate: (data) => this.onUpdate(index, data),
        onPlay: () => this.onPlay(index)
      });

      this.flowRefs[index] = flowInstance;
      this.container.appendChild(flowInstance.element);

      // Add search component after flow
      const searchComponent = new Search(this.programFlows, (flowType) => {
        this.onPush(index + 1, flowType);
      });
      this.container.appendChild(searchComponent.element);
    });
  }

  update(graph) {
    this.graph = graph;
    this.render();
  }
}

export default Flows;
