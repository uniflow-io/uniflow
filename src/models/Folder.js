import moment from 'moment'

export default class Folder {
  constructor (data) {
    Object.assign(this, data)

    this.created = moment(this.created)
    this.updated = moment(this.updated)
  }
}
