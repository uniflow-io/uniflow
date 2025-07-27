import { forwardRef } from "react";

/**
 * @typedef {Object} FlowMetadata
 * @property {string[]} clients - List of client names
 * @property {string} name - Flow name
 * @property {string[]} tags - Flow tags
 */

/**
 * @typedef {Object} FlowRunner
 * @property {function(string=): any} run - Function to run code
 * @property {function(): any} getContext - Function to get context
 */

/**
 * @typedef {Object} FlowHandle
 * @property {function(): (string|undefined)} onSerialize - Serialize flow data
 * @property {function(string=): Object} onDeserialize - Deserialize flow data
 * @property {function(string): string} onCompile - Compile for specific client
 * @property {function(FlowRunner): Promise<void>} onExecute - Execute the flow
 */

/**
 * @typedef {Object} FlowProps
 * @property {boolean} isPlaying - Whether flow is playing
 * @property {Object} [data] - Optional flow data
 * @property {string[]} clients - List of available clients
 * @property {function()} onPop - Callback when flow is popped
 * @property {function(Object)} onUpdate - Callback when flow is updated
 * @property {function()} onPlay - Callback when flow is played
 */

/**
 * Higher-order component to create a flow component
 *
 * @param {function(FlowProps, React.Ref): React.ReactElement} render - The render function for the flow
 * @returns {React.ForwardRefExoticComponent} The flow component
 */
export const flow = (render) => {
  return forwardRef(render);
};
