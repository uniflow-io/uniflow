export default class ComponentText {
    constructor() {
        this.variable = null
    }

    deserialise(data) {
        let [variable] = data ? data : [null];

        this.variable = variable
    }

    onCompile(interpreter, scope, asyncWrapper) {

    }

    onExecute(runner) {
        if (this.variable) {
            runner.setValue(this.variable, 'chrome');
        }
    }
}
