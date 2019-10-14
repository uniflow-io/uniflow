import consoleBridge from '../bridges/console'
import vm from 'vm'

export default class Runner {
    constructor(api, background) {
        this.api = api
        this.background = background
    }

    run(rail) {
        const context = new vm.createContext({
            console: consoleBridge(this.background)
        });

        return rail.reduce((promise, flow) => {
            return promise.then(() => {
                return vm.runInContext(flow.code || '', context);
            })
        }, Promise.resolve())
    }
}

