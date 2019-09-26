function Program(data) {
    Object.assign(this, data);
}

Program.prototype.serialiseFlowData = function (data) {
    this.data = JSON.stringify(data);
}

Program.prototype.deserialiseFlowData = function () {
    return JSON.parse(this.data);
}

module.exports = Program
