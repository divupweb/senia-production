
import * as moment from 'moment-timezone';

moment.prototype.formatUTC = function(inputString) {
  return this.clone().utc().format(inputString);
}

moment.prototype.toDateTZ = function() {
  let params = this.toArray();
  return new Date(params[0], params[1], params[2], params[3], params[4], params[5]);
}

moment.parseDate = function(date) {
  let params = ['getFullYear', 'getMonth', 'getDate', 'getHours', 'getMinutes', 'getSeconds'].map((e) => date[e]());
  return moment(params);
}

window['moment'] = moment;
