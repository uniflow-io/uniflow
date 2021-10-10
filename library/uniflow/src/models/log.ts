import moment from 'moment';

export enum LOG_STATUS {
  NEW = 'NEW',
  READ = 'READ',
}

export default class Log {
  public created: moment.Moment;
  public id = 0;
  public message = '';
  public status: LOG_STATUS = LOG_STATUS.NEW;
  constructor(data: { id: number; message: string; status: string }) {
    Object.assign(this, data);
    this.created = moment();
  }
}
