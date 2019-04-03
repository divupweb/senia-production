import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component {
  @ViewChild('defaultOrders') defaultOrders;
  changed = false;

  onChange($event) {
    this.changed = true;
  }
}
