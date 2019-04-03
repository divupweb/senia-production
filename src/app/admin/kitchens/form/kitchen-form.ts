import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "app/services";

export abstract class KitchenForm {

  public form: FormGroup;

  public buildForm(): void {
    this.form = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required, ValidationService.emailValidator])),
      address: new FormControl('', Validators.required),
      address2: new FormControl(''),
      headChefName: new FormControl('', Validators.required),
      active: new FormControl(false),
      approvedAt: new FormControl(),
      city: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      zipCode: new FormControl('', Validators.required),
      bankAccount: new FormControl(''),
      vatNumber: new FormControl('')
    });
  }
}
