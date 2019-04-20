export default class ComponentText {
    constructor() {
        this.variable = null
        this.text = null
    }

    deserialise(data) {
        let [variable, text] = data ? data : [null, null];

        this.variable = variable
        this.text = text
    }

    onCompile(interpreter, background, scope, asyncWrapper) {

    }

    onExecute(runner) {
        if (this.variable) {
            runner.setValue(this.variable, this.text);
        }
    }
}
