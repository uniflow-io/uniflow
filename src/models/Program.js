import {Bus} from 'uniflow/src/models'
import moment from 'moment'

export default class Program {
  constructor(data) {
    Object.assign(this, data)

    this.created = moment(this.created)
    this.updated = moment(this.updated)
  }

  serialiseFlowData(data) {
    let objData = []

    for (let i = 0; i < data.length; i++) {
      objData.push({
        component: data[i].component,
        data: data[i].data
      })
    }

    this.data = JSON.stringify(objData)
  }

  deserialiseFlowData() {
    let objData = JSON.parse(this.data)

    let data = []

    for (let i = 0; i < objData.length; i++) {
      data.push({
        component: objData[i].component,
        data: objData[i].data,
        bus: new Bus()
      })
    }

    return data
  }
}
