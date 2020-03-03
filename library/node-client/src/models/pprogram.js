function Program(data) {
  Object.assign(this, data)
}

Program.prototype.serializeRailData = function(data) {
  this.data = JSON.stringify(data)
}

Program.prototype.deserializeRailData = function() {
  return JSON.parse(this.data)
}

module.exports = Program
