import { Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormGroup } from "@angular/forms";

export abstract class CompanyCreditsShared {
  employeeIds = [];
  employees;
  companyId;
  initialCredit;
  show = false;

  open(id, creditValue) {
    this.companyId = id;
    this.initialCredit = creditValue;
    this.onOpen();
    this.initForm();
    this.load();
    setTimeout(()=> this.show = true, 50);
  }

  close() {
    this.show = false;
    this.employeeIds = [];
  }

  onOpen() {};
  abstract load(): void;

  abstract initForm(): void;

  toggleEmployee(employeeId, e) {
    if (e.target.checked) {
      this.employeeIds.push(employeeId)
    } else {
      _.pull(this.employeeIds, employeeId)
    }
  }

  allEmployeesChecked() {
    return this.employeeIds && this.employeeIds.length > 0 && this.employees.length == this.employeeIds.length
  }

  checkAllEmployees(e) {
    if (e.target.checked) {
      this.employeeIds = _.map(this.employees, 'id');
    } else {
      this.employeeIds = [];
    }
  }

  employeeChecked(id) {
    return _.includes(this.employeeIds, id)
  }

  valueChecked(form: FormGroup, type, value = 0): boolean {
    if (value > 0) form.get(type).markAsTouched();
    return form.get(type).touched;
  }

  valueCheck(form: FormGroup, type, e, value = 0) {
    const control: AbstractControl = form.get(type);
    if (e.target.checked) {
      control.setValue(value);
      control.markAsTouched();
    } else {
      control.reset();
    }
  }

}
