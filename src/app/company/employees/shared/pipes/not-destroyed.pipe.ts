import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'notDestroyed'
})

export class NotDestroyedPipe implements PipeTransform {
  constructor() {}

  transform(items, args) {
    return items.filter( e => e._destroy != 1);
  }
}
