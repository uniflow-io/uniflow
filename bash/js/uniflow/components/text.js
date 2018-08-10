function ComponentBash() {
    this.variable = null
    this.text = null
}

ComponentBash.prototype.deserialise = function(data) {
    let [variable, text] = data ? data : [null, null];

    this.variable = variable
    this.text = text
}

ComponentBash.prototype.onExecute = function(runner) {
    let text = this.text.split("\n").join('\\n')
    text = text.replace(/\"/g, '\\"')
    text = text.replace(/\$/g, '\\$')

    return runner.eval(`${this.variable}="${text}"`)
}

module.exports = ComponentBash
