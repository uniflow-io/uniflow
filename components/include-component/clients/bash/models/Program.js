function Program(data) {
    Object.assign(this, data);
}

Program.prototype.serialiseRailData = function (data) {
    let objData = [];

    for (let i = 0; i < data.length; i++) {
        objData.push({
            component: data[i].component,
            data: data[i].data
        });
    }

    this.data = JSON.stringify(objData);
}

Program.prototype.deserialiseRailData = function () {
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

module.exports = Program
