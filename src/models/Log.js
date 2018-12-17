import moment from 'moment'

export default class Log {
    static get HISTORY_CREATE_FAIL() { return 1 }
    static get HISTORY_DATA_SET_FAIL() { return 2 }
    static get USER_LOGIN_FAIL() { return 3 }

    constructor(data) {
        Object.assign(this, data);

        this.created = moment(this.created);
    }
}
