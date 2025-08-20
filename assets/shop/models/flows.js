import React from 'react';
import { createRoot } from 'react-dom/client';
import FunctionFlow from './../components/flow-function/index.jsx'
import PromptFlow from './../components/flow-prompt/index.jsx'
import AssetsFlow from './../components/flow-assets/index.jsx'
import TextFlow from './../components/flow-text/index.jsx'
import CanvasFlow from './../components/flow-canvas/index.jsx'
import ObjectFlow from './../components/flow-object/index.jsx'
import { ClientType } from './client-type';


export const flows = {
  '@uniflow-io/uniflow-flow-function': FunctionFlow,
  '@uniflow-io/uniflow-flow-prompt': PromptFlow,
  '@uniflow-io/uniflow-flow-text': TextFlow,
  '@uniflow-io/uniflow-flow-assets': AssetsFlow,
  '@uniflow-io/uniflow-flow-canvas': CanvasFlow,
  '@uniflow-io/uniflow-flow-object': ObjectFlow,
}

export const flowsNames = {
  '@uniflow-io/uniflow-flow-function': 'Function Flow',
  '@uniflow-io/uniflow-flow-prompt': 'Prompt Flow',
  '@uniflow-io/uniflow-flow-text': 'Text Flow',
  '@uniflow-io/uniflow-flow-assets': 'Assets Flow',
  '@uniflow-io/uniflow-flow-canvas': 'Canvas Flow',
  '@uniflow-io/uniflow-flow-object': 'Object Flow',
}

export const flowsClients = {
  '@uniflow-io/uniflow-flow-function': [
      ClientType.UNIFLOW,
      ClientType.PHP,
      ClientType.NODE,
      ClientType.VSCODE,
    ],
  '@uniflow-io/uniflow-flow-prompt': [
      ClientType.UNIFLOW,
    ],
  '@uniflow-io/uniflow-flow-text': [
      ClientType.UNIFLOW,
    ],
  '@uniflow-io/uniflow-flow-assets': [
      ClientType.UNIFLOW,
    ],
  '@uniflow-io/uniflow-flow-canvas': [
    ClientType.UNIFLOW,
  ],
  '@uniflow-io/uniflow-flow-object': [
    ClientType.UNIFLOW,
  ],
}

