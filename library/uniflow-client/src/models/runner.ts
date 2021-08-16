import consoleBridge from '../bridges/console';
import axiosBridge from '../bridges/axios';
import vm from 'vm';

export default class Runner {
  run(flows) {
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
  }
}
