import { Injectable } from '@angular/core';

@Injectable()
export class DishValidator {
  static priceRange(priceRange) {
    return (control) => {
      if (control && (control.value >= priceRange.min) && (control.value <=  priceRange.max)) {
        return null;
      }

      return {invalidPriceRange: true};
    }
  }
}
