import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'upperFirst'
})

export class UpperFirstPipe implements PipeTransform {
  constructor() {}

  transform(value: any, args: any[]) {
    return _.upperFirst(value);
  }
}
