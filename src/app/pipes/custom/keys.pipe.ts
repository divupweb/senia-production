import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'keys'
})

export class KeysPipe implements PipeTransform {

  public transform(value: any, args: any[]): string[] {
   return _.keys(value);
  }
}
