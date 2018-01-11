import moment from 'moment'

export default class Log {
    static get HISTORY_CREATE_FAIL() { return 1 }

    constructor(data) {
        Object.assign(this, data);

        this.created = moment(this.created);
    }
}