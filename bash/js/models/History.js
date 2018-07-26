const moment = require('moment')

function History(data) {
    Object.assign(this, data);

    this.created = moment(this.created);
    this.updated = moment(this.updated);
}

History.prototype.serialiseFlowData = function (data) {
    let objData = [];

    for (let i = 0; i < data.length; i++) {
        objData.push({
            component: data[i].component,
            data: data[i].data
        });
    }

    this.data = JSON.stringify(objData);
}

History.prototype.deserialiseFlowData = function () {
    let objData = JSON.parse(this.data);

    let data = [];

    for (let i = 0; i < objData.length; i++) {
        data.push({
            component: objData[i].component,
            data: objData[i].data
        });
    }

    return data;
}

module.exports = History