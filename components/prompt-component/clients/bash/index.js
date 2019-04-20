function PromptComponent() {
  this.variable = null
  this.messageVariable = null
  this.type = null
}

PromptComponent.prototype.deserialise = function(data) {
  let [variable, messageVariable, type] = data ? data : [null, null, null];

  this.variable = variable
  this.messageVariable = messageVariable
  this.type = type
}

PromptComponent.prototype.onExecute = function(runner) {
  let bash = `if [ "\${${this.messageVariable}+1}" ]
then
  echo "$${this.messageVariable}"
fi
read ${this.variable}`

  return runner.eval(bash)
}

module.exports = PromptComponent
