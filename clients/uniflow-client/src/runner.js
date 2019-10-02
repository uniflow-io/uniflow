import consoleBridge from './bridges/console'
import vm from 'vm';

export default class Runner {
  run(stack, onRunIndex) {
    const context = new vm.createContext({
      console: consoleBridge
    });

    return stack.reduce((promise, flow, index) => {
      return promise
        .then(() => {
          return onRunIndex(index)
        })
        .then(() => {
          return vm.runInContext(flow.code || '', context);
        })
        .then(() => {
          return onRunIndex(null)
        })
    }, Promise.resolve())
  }
}
