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
            return new Promise(resolve => {
                if (this.state.messageVariable && runner.hasValue(this.state.messageVariable)) {
                    this.setState({ message: runner.getValue(this.state.messageVariable) }, resolve)
                } else {
                    this.setState({ message: null }, resolve)
                }
            })
                .then(() => {
                    return new Promise(resolve => {
                        this.setState({ promptDisplay: true, input: null }, resolve)
                    })
                })
                .then(() => {
                    return new Promise(resolve => {
                        this.inputResolve = resolve
                    })
                })
                .then(() => {
                    if (this.state.variable) {
                        runner.setValue(this.state.variable, this.state.input)
                    }
                })
                .then(() => {
                    return new Promise(resolve => {
                        this.setState({ promptDisplay: false }, resolve)
                    })
                })
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
