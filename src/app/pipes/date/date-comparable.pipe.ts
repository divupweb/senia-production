import { Pipe, PipeTransform } from '@angular/core';

abstract class Comparable {

  public getMoment(value: any) {
    if (moment.isMoment(value)) {
      return value;
    }
    return moment(value, moment.ISO_8601)
  }
}

@Pipe({
  name: 'isToday'
})
export class IsTodayPipe extends Comparable implements PipeTransform {
  transform(value: any, args: any[]): boolean {
    return moment().isSame(this.getMoment(value), 'day');
  }
}

@Pipe({
  name: 'isTomorrow'
})
export class IsTomorrowPipe extends Comparable implements PipeTransform {
  transform(value: any, args: any[]) {
    return moment().add(1, 'day').isSame(this.getMoment(value), 'day');
  }
}

@Pipe({
  name: 'isPassed'
})
export class IsPassedPipe extends Comparable implements PipeTransform {
  transform(value: any, args: any[]) {
    return this.getMoment(value).isBefore(moment().startOf('day'))
  }
}
