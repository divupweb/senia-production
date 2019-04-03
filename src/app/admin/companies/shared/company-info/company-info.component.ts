import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent  {
  @Input() company;
  @Input() remove = true;;
  @Output() onRemove = new EventEmitter();

  removeCompany() {
    this.onRemove.emit(this.company);
  }
}
