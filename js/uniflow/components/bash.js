function ComponentBash() {
    this.bash = null
}

ComponentBash.prototype.deserialise = function(data) {
    this.bash = data
}

ComponentBash.prototype.onExecute = function(runner) {
    return runner.eval(this.bash)
}

module.exports = ComponentBash
