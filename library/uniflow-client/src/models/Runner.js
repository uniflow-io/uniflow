import consoleBridge from '../bridges/console'
import httpBridge from '../bridges/http'
import vm from 'vm'

export default class Runner {
  run(rail) {
    const context = new vm.createContext({
      console: consoleBridge,
      http: httpBridge,
    })

    let runner = {
      run: code => {
        return vm.runInContext(code || '', context)
      },
      getContext: () => {
        return context
      },
    }

    return rail.reduce((promise, flow) => {
      return promise.then(() => {
        return flow.bus.emit('execute', runner)
      })
    }, Promise.resolve())
  }
}
