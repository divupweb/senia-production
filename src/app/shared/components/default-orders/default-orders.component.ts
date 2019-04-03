import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'


import { PeriodicsData, PeriodicOptions } from './services';

@Component({
  selector: 'default-orders',
  templateUrl: './default-orders.html',
  providers: [PeriodicsData, PeriodicOptions]
})

export class DefaultOrdersComponent {
  @ViewChild('popup') popup;
  @Input() saveByPopup = false;
  @Output() onChange = new EventEmitter();
  constructor(private periodicsData: PeriodicsData, private router: Router) { }

  ngOnInit() {
    this.periodicsData.saveByPopup = this.saveByPopup;
    this.periodicsData.load();
  }

  save() {
    this.periodicsData.save().subscribe(
      (data) => {
        this.router.navigate(['/user'])
      }
    );
  }

  dayOnChange(event) {
    this.onChange.emit(event);
  }
}
