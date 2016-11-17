import Vue from 'vue'
import moment from 'moment'

class History {
    constructor(data) {
        Object.assign(this, data);

        this.created = moment(this.created);
        this.updated = moment(this.updated);
    }

    serialiseFlowData(data) {
        var objData = [];

        for(let i = 0; i < data.length; i++) {
            objData.push({
                component: data[i].component,
                data: data[i].data
            });
        }

        this.data = JSON.stringify(objData);
    }

    deserialiseFlowData() {
        var objData = JSON.parse(this.data);

        var data = [];

        for(let i = 0; i < objData.length; i++) {
            data.push({
                component: objData[i].component,
                data: objData[i].data,
                bus: new Vue()
            });
        }

        return data;
    }

    equal(history) {
        var data = {
            id: this.id,
            title: this.title,
            tags: this.tags
        }, historyData = {
            id: history.id,
            title: history.title,
            tags: history.tags
        };

        return JSON.stringify(data) === JSON.stringify(historyData);
    }
}

export default History;