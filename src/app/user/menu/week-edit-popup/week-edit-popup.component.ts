import { Component } from '@angular/core';

@Component({
  selector: 'week-edit-popup',
  providers: [],
  styleUrls: ['week-edit-popup.scss'],
  templateUrl: 'week-edit-popup.html'
})

export class WeekEditPopup {
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;

  tabToggle(tab1,tab2,tab3) {
    this.tab1 = tab1;
    this.tab2 = tab2;
    this.tab3 = tab3;
  }
}
