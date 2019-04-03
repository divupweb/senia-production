import { Injectable } from '@angular/core';
import { TimepickerConfig } from 'ng2-bootstrap/timepicker';

@Injectable()
export class TimePickerConfigService {
  /** hours change step */
  hourStep: number = 1;
  /** hours change step */
  minuteStep: number = 10;
  /** if true works in 12H mode and displays AM/PM. If false works in 24H mode and hides AM/PM */
  showMeridian: boolean  = false;
  /** meridian labels based on locale */
  meridians: string[];
  /** if true hours and minutes fields will be readonly */
  readonlyInput: boolean  = false;
  /** if true scroll inside hours and minutes inputs will change time */
  mousewheel: boolean = true;
  /** if true up/down arrowkeys inside hours and minutes inputs will change time */
  arrowkeys: boolean = true ;
  /** if true spinner arrows above and below the inputs will be shown */
  showSpinners: boolean = true;
  /** minimum time user can select */
  min: number;
  /** maximum time user can select */
  max: number;
  constructor() {
    // Object.assign(this, new TimepickerConfig())
    _.each(new TimepickerConfig(), (v, k) => {
      let value = this[k]
      if (value === undefined) this[k] = v
    })
  }
}

export let TimePickerConfigProvider = {
  provide: TimepickerConfig, useClass: TimePickerConfigService
};
