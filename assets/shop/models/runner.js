import consoleBridge from '../bridges/console';
import fetchBridge from '../bridges/fetch';
import { ClientType } from './client-type';

export default class Runner {
  async run(flows, flowsRef) {
    const context = {
      console: consoleBridge,
      axios: fetchBridge,
    };

    for(let index = 0; index < flows.length; index++) {
      const runner = {
        run: () => {
          const code = flowsRef.current?.onCompile(index, ClientType.UNIFLOW)
          try {
            const func = new Function('context', `
              with (context) {
                ${code || ''}
              }
            `);
            return func(context);
          } catch (error) {
            console.error('Error executing flow code:', error);
            return null;
          }
        },
        getContext: () => {
          return context;
        },
      };

      //commitPlayFlow(index)(graphDispatch);
      await flowsRef.current?.onExecute(index, runner)
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
      //commitStopFlow(index)(graphDispatch);
    }
  }
}
