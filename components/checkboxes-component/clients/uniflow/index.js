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
                let values = runner.getValue(this.state.variable)

                let checkboxes = {}
                for (let i = 0; i < values.length; i++) {
                    checkboxes[values[i]] = this.state.checkboxes[values[i]] || false
                }
                this.setState({ checkboxes: checkboxes }, this.onUpdate)

                values = values.filter(value => {
                    return checkboxes[value]
                })

                runner.setValue(this.state.variable, values)
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
