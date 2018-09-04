function ComponentJavascript() {
    this.javascript = null
}

ComponentJavascript.prototype.deserialise = function(data) {
    this.javascript = data
}

ComponentJavascript.prototype.onExecute = function(runner) {
    return runner.eval(this.javascript)
}

module.exports = ComponentJavascript
