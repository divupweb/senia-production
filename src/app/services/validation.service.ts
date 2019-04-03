export class ValidationService {
  static emailValidator(control) {
    // RFC 2822 compliant regex
    const value = control.value;
    if (_.isString(value) && value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  static checked(control) {
    if (control.value) {
      return null;
    } else {
      return { 'check box should be checked': true };
    }
  }


  static matchPassword(form) {
    let password = form.get('password');
    let confirm = form.get('passwordConfirmation');

    if (password.value && confirm.value && password.value != confirm.value) {
      confirm.setErrors({ matchPassword: true })
    } else {
      if (confirm.hasError('matchPassword')) delete confirm.errors['matchPassword']
      return null
    }
  }
}
