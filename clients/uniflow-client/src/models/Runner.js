import consoleBridge from '../bridges/console'
import vm from 'vm';

export default class Runner {
  run(stack) {
    const context = new vm.createContext({
      console: consoleBridge
    });

    let runner = {
      run: (code) => {
        return vm.runInContext(code || '', context);
      }
    }

    return stack.reduce((promise, flow, index) => {
      return promise
        .then(() => {
          return flow.bus.emit('execute', runner)
        })
    }, Promise.resolve())
  }
}
