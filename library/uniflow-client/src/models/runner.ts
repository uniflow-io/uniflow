import consoleBridge from '../bridges/console';
import axiosBridge from '../bridges/axios';
import vm from 'vm';
import { commitPlayFlow, commitStopFlow, GraphDispath, GraphProviderState } from '../contexts';
import { RefObject } from 'react';
import { FlowsHandle } from '../components/flows';
import { ClientType } from './interfaces';

export default class Runner {
  async run(flows: GraphProviderState['flows'], flowsRef: RefObject<FlowsHandle>, graphDispatch: GraphDispath) {
    const context = vm.createContext({
      console: consoleBridge,
      axios: axiosBridge,
    });

    for(let index = 0; index < flows.length; index++) {
      const runner = {
        run: () => {
          const code = flowsRef.current?.onCompile(index, ClientType.UNIFLOW)
          return vm.runInContext(code || '', context);
        },
        getContext: () => {
          return context;
        },
      };

      commitPlayFlow(index)(graphDispatch);
      await flowsRef.current?.onExecute(index, runner)
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
      commitStopFlow(index)(graphDispatch);
    }
  }
}
