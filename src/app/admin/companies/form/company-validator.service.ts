import { Injectable } from '@angular/core';

@Injectable()
export class CompanyValidator {
  constructor() { }

  profitMargin(control: any): { [s: string]: boolean } {
      if (!control.root.value['relatedKitchenId'] || (control.value > 0)) {
        return null;
      }
      return {invalidProfitMargin: true};
  }
}
