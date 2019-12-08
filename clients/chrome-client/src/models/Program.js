function Program(data) {
  Object.assign(this, data)
}

Program.prototype.serialiseRailData = function(data) {
  this.data = JSON.stringify(data)
}

Program.prototype.deserialiseRailData = function() {
  return JSON.parse(this.data)
}

module.exports = Program
