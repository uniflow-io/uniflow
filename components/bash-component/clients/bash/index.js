function BashComponent() {
    this.bash = null
}

BashComponent.prototype.deserialise = function(data) {
    this.bash = data
}

BashComponent.prototype.onExecute = function(runner) {
    return runner.eval(this.bash)
}

module.exports = BashComponent
