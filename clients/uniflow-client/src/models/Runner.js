import consoleBridge from '../bridges/console'
import vm from 'vm';

export default class Runner {
  run(rail) {
    const context = new vm.createContext({
      console: consoleBridge
    });

    let runner = {
      run: (code) => {
        return vm.runInContext(code || '', context);
      }
    }

    return rail.reduce((promise, flow, index) => {
      return promise
        .then(() => {
          return flow.bus.emit('execute', runner)
        })
    }, Promise.resolve())
  }
}
