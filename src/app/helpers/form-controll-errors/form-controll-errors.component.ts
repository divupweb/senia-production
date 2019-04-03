import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-controll-errors',
  templateUrl: './form-controll-errors.component.html',
  styleUrls: ['./form-controll-errors.component.scss']
})
export class FormControllErrorsComponent {
  @Input() form;
  @Input() controlName;
  @Input() translation;
  control;

  ngOnChanges(changes) {
    if (changes['controlName'] && !this.translation) {
      this.initTranslation();
    }

    if (this.form && this.controlName &&
      (changes['form'] || changes['controlName'])) {
      this.control = this.form.get(this.controlName)
    };
  }

  private initTranslation() {
    if (!this.controlName) return;
    let name = _.snakeCase(this.controlName).toUpperCase();
    this.translation = `CONTROLS.${name}`
  }
}
