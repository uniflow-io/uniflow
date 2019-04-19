const onCompile = function(interpreter, scope, asyncWrapper) {

}

const onExecute = function(runner) {
    return Promise
        .resolve()
        .then(() => {
            return new Promise(resolve => {
                this.setState({ running: true }, resolve)
            })
        }).then(() => {
            if (this.state.variable) {
                if (runner.hasValue(this.state.variable)) {
                    let object = runner.getValue(this.state.variable)
                    let keyvaluelist = this.reverseTransform(object)
                    this.setState({ keyvaluelist: keyvaluelist }, this.onUpdate)
                } else {
                    let object = this.transform()
                    runner.setValue(this.state.variable, object)
                }
            }
        })
        .then(() => {
            return new Promise(resolve => {
                setTimeout(resolve, 500)
            })
        })
        .then(() => {
            return new Promise(resolve => {
                this.setState({ running: false }, resolve)
            })
        })
}



export { onCompile, onExecute }
