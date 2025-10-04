import React from 'react';
import { createRoot } from 'react-dom/client';
import FunctionFlow from './../components/flow/function-flow.jsx'
import PromptFlow from './../components/flow/prompt-flow.jsx'
import AssetsFlow from './../components/flow/assets-flow.jsx'
import TextFlow from './../components/flow/text-flow.jsx'
import CanvasFlow from './../components/flow/canvas-flow.jsx'
import ObjectFlow from './../components/flow/object-flow.jsx'
import HtmlFlow from './../components/flow/html-flow.jsx'
import { ClientType } from './client-type';


export const flows = {
  '@uniflow-io/uniflow-flow-function': FunctionFlow,
  '@uniflow-io/uniflow-flow-prompt': PromptFlow,
  '@uniflow-io/uniflow-flow-text': TextFlow,
  '@uniflow-io/uniflow-flow-assets': AssetsFlow,
  '@uniflow-io/uniflow-flow-canvas': CanvasFlow,
  '@uniflow-io/uniflow-flow-object': ObjectFlow,
  '@uniflow-io/uniflow-flow-html': HtmlFlow,
}

export const flowsNames = {
  '@uniflow-io/uniflow-flow-function': 'Function Flow',
  '@uniflow-io/uniflow-flow-prompt': 'Prompt Flow',
  '@uniflow-io/uniflow-flow-text': 'Text Flow',
  '@uniflow-io/uniflow-flow-assets': 'Assets Flow',
  '@uniflow-io/uniflow-flow-canvas': 'Canvas Flow',
  '@uniflow-io/uniflow-flow-object': 'Object Flow',
  '@uniflow-io/uniflow-flow-html': 'HTML Flow',
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
  '@uniflow-io/uniflow-flow-html': [
    ClientType.UNIFLOW,
  ],
}

