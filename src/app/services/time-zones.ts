const DEFAULT_TIME_ZONE = 'Europe/Oslo';

export class TimeZones {
  static set(account) {
    let timeZone = _.get(account, 'time_zone', DEFAULT_TIME_ZONE);
    if (!!moment.defaultZone && moment.defaultZone.name == timeZone) return;
    console.debug('Set default time zone: ' + timeZone);
    moment.tz.setDefault(timeZone);
    console.debug('Your current time: ' + moment().format('LLLL'));
  }
}
