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
            if (this.state.variable && runner.hasValue(this.state.variable)) {
                this.setState({ choices: runner.getValue(this.state.variable) }, this.onUpdate)

                runner.setValue(this.state.variable, this.state.selected)
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
