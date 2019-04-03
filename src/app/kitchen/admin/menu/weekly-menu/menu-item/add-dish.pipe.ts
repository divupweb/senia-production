import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'addDish'
})
export class AddDishPipe implements PipeTransform {

  public constructor(protected translate: TranslateService) {}
  transform(dish: any, args?: any): any {
    return  !!dish ? dish.name : this.translate.instant('KITCHENS.BUTTONS.ADD_DISH');
  }
}
