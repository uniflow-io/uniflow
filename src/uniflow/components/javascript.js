export default class ComponentJavascript {
    constructor() {
        this.javascript = null
    }

    deserialise(data) {
        this.javascript = data
    }

    onCompile(interpreter, scope, asyncWrapper) {

    }

    onExecute(runner) {
        return runner.eval(this.javascript)
    }
}
