const onCompile = function(interpreter, scope, asyncWrapper) {

}

const onExecute = function(runner) {
    return Promise
        .resolve()
        .then(() => {
            return new Promise(resolve => {
                this.setState({running: true}, resolve)
            })
        }).then(() => {
            return runner.eval(this.state.javascript)
        })
        .then(() => {
            return new Promise(resolve => {
                setTimeout(resolve, 500)
            })
        })
        .then(() => {
            return new Promise(resolve => {
                this.setState({running: false}, resolve)
            })
        })
}

export { onCompile, onExecute }
