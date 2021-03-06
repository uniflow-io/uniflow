function Program(data) {
  Object.assign(this, data)
}

Program.prototype.serializeFlowsData = function(data) {
  this.data = JSON.stringify(data)
}

Program.prototype.deserializeFlowsData = function() {
  return JSON.parse(this.data)
}

module.exports = Program
