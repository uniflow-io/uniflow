const onCompile = function(interpreter, scope, asyncWrapper) {
    [this.state.if.conditionStack, this.state.if.executeStack]
        .concat(this.state.elseIfs.reduce((stacks, elseIf) => {
            stacks.push(elseIf.conditionStack)
            stacks.push(elseIf.executeStack)
            return stacks
        }, []))
        .concat(this.state.else ? [this.state.else.executeStack] : [])
        .forEach(stack => {
            stack.forEach(item => {
                item.bus.emit('compile', interpreter, scope)
            })
        })
}

const onExecute = function(runner) {
    return Promise
        .resolve()
        .then(() => {
            return new Promise(resolve => {
                this.setState({ running: true }, resolve)
            })
        }).then(() => {
            let stackEval = function (stack) {
                return stack.reduce((promise, item) => {
                    return promise.then(() => {
                        return item.bus.emit('execute', runner)
                    })
                }, Promise.resolve()).then(() => {
                    return runner.getReturn()
                })
            }

            return stackEval(this.state.if.conditionStack)
                .then(value => {
                    if (value === true) {
                        return stackEval(this.state.if.executeStack)
                    }

                    return this.state.elseIfs.reduce((promise, elseIf) => {
                        return promise
                            .then(isResolved => {
                                if (!isResolved) {
                                    return stackEval(elseIf.conditionStack)
                                        .then(value => {
                                            if (value === true) {
                                                return stackEval(elseIf.executeStack)
                                                    .then(() => {
                                                        return true
                                                    })
                                            }

                                            return false
                                        })
                                }

                                return isResolved
                            })
                    }, Promise.resolve(false)).then(isResolved => {
                        if (!isResolved && this.state.else) {
                            return stackEval(this.state.else.executeStack)
                        }
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
