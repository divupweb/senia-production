import {FormGroup} from "@angular/forms";
import {ToastService} from "app/services/toast";

export class Forms {

  public form: FormGroup;
  public toast: ToastService;

  public handleErrors(response: any): void {
    let errors = {};
    _.each(response, (value: any, key: string) => {
      const controlName = _.camelCase(key);
      if (this.form.contains(controlName)) {
        const control = this.form.get(controlName);
        control.markAsTouched();
        control.setErrors({ server: value });
        errors[controlName] = value;
      }
    });
    if (_.isEmpty(errors)) {
      this.toast.error(response);
    } else {
      this.form.setErrors(errors);
    }
  }

  static valid(form: FormGroup) {
    Forms.markAsTouched(form);
    return form.valid;
  }

  static invalid(form) {
    return !Forms.valid(form);
  }

  static markAsTouched(group) {
    _.each(group.controls, (c: FormGroup) => {
      if (c.controls) {
        Forms.markAsTouched(c)
      } else {
        c.markAsTouched();
      }
    });
  }
}
