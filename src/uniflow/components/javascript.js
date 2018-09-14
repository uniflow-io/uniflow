export default class ComponentJavascript {
    constructor() {
        this.javascript = null
    }

    deserialise(data) {
        this.javascript = data
    }

    onCompile(interpreter, background, scope, asyncWrapper) {

    }

    onExecute(runner) {
        return runner.eval(this.javascript)
    }
}
