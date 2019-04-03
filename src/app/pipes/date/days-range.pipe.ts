import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysRange'
})

export class DaysRangePipe implements PipeTransform {
  short: string = 'D';
  full: string = 'D MMMM';

  transform(dates: string[], args: any[]): string {
    let df = (date) => moment(date, moment.ISO_8601);
    let range = _.flatten([dates]);
    let start = df(range[0]);
    let end = range.length > 1 ? df(_.last(range)) :  start.clone().day(7)
    let startFormat: string = start.month() == end.month() ? this.short : this.full;
    return `${start.format(startFormat)} - ${end.format(this.full)}`;
  }
}
