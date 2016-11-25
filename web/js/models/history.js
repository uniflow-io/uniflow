import Vue from 'vue'
import moment from 'moment'

class History {
    constructor(data) {
        Object.assign(this, data);

        this.created = moment(this.created);
        this.updated = moment(this.updated);
    }

    serialiseFlowData(data) {
        let objData = [];

        for(let i = 0; i < data.length; i++) {
            objData.push({
                component: data[i].component,
                data: data[i].data
            });
        }

        this.data = JSON.stringify(objData);
    }

    deserialiseFlowData() {
        let objData = JSON.parse(this.data);

        let data = [];

        for(let i = 0; i < objData.length; i++) {
            data.push({
                component: objData[i].component,
                data: objData[i].data,
                bus: new Vue()
            });
        }

        return data;
    }
}

export default History;