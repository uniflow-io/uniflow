function ComponentBash() {
    this.variable = null
    this.messageVariable = null
    this.type = null
}

ComponentBash.prototype.deserialise = function(data) {
    let [variable, messageVariable, type] = data ? data : [null, null, null];

    this.variable = variable
    this.messageVariable = messageVariable
    this.type = type
}

ComponentBash.prototype.onExecute = function(runner) {
    let bash = `if [ -z "$${this.messageVariable}" ]; then echo "$${this.messageVariable}"; fi
    read ${this.variable}`

    console.log(bash)

    return runner.eval(bash)
}

module.exports = ComponentBash
