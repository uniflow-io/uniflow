function TextComponent() {
  this.variable = null
  this.text = null
}

TextComponent.prototype.deserialise = function(data) {
  let [variable, text] = data ? data : [null, null];

  this.variable = variable
  this.text = text
}

TextComponent.prototype.onExecute = function(runner) {
  let text = this.text
  text = text.replace(/\n/g, '\\n')
  text = text.replace(/\"/g, '\\"')
  text = text.replace(/\$/g, '\\$')

  return runner.eval(`${this.variable}="${text}"`)
}

module.exports = TextComponent
