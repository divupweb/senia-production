import { Pipe, PipeTransform } from '@angular/core';
import {Employee} from "../models";
@Pipe({
  name: 'employeeFilter'
})

export class EmployeeFilterPipe implements PipeTransform {

  public transform(items: Employee[], filter: string): any[] {
    if (filter) {
      const lowerCase = filter.toLowerCase();
      return items.filter((e) => ['name', 'email'].some((field: string) => _.includes(e[field].toLowerCase(), lowerCase)));
    }
    return items;
  }
}
