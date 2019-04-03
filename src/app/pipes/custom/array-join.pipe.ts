import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayJoin'
})

export class ArrayJoinPipe implements PipeTransform {
  constructor() {}

  transform(value: any[], args: any[]) {
    // join array with last 'and'
    var str = '';
    if(value) {
      if (value.length  > 1) {
        str = value.slice(0, -1).join(', ') + ' and ' + value.slice(-1);
      } else {
        str = value[0]
      }
    }
    return str;
  }
}
