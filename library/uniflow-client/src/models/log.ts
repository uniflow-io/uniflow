import moment from 'moment';

export default class Log {
  static get FEED_CREATE_FAIL() {
    return 1;
  }

  static get FEED_DATA_SET_FAIL() {
    return 2;
  }

  static get USER_LOGIN_FAIL() {
    return 3;
  }

  public created: moment.Moment;
  public id: number = 0;
  public message: string = '';
  public status: string = '';
  constructor(data: {id: number; message: string; status: string}) {
    Object.assign(this, data);
    this.created = moment();
  }
}
