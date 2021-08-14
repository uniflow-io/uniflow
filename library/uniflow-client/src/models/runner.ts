import consoleBridge from '../bridges/console';
import axiosBridge from '../bridges/axios';
import vm from 'vm';

export default class Runner {
  run(flows) {
    // @ts-expect-error ts-migrate(2350) FIXME: Only a void function can be called with the 'new' ... Remove this comment to see the full error message
    const context = new vm.createContext({
      console: consoleBridge,
      axios: axiosBridge,
    });

    const runner = {
      run: (code) => {
        return vm.runInContext(code || '', context);
      },
      getContext: () => {
        return context;
      },
    };

    return flows.reduce((promise, flow) => {
      return promise.then(() => {
        return flow.bus.emit('execute', runner);
      });
    }, Promise.resolve());
  }
}
