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
                try {
                    let builder = new SRL(this.state.expression)
                    runner.setValue(this.state.variable, builder.get())
                } catch (e) {
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
