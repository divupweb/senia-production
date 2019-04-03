import {Component, OnInit, ViewChild, Renderer2} from '@angular/core';
import { RegisterKitchenService } from './kitchen-register.service';
import {
  ToastService, Analytics, ObjectLoader, ValidationService,
  AccountsProxy
} from "app/services";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import {NearestLocationService} from "app/services/nearest-location.service";
import {DropdownComponent} from "app/helpers/dropdown";


@Component({
  selector: 'kitchen-register',
  providers: [RegisterKitchenService],
  templateUrl: './kitchen-register.html',
  styleUrls: [ '../home-auth.scss', 'kitchen-register.scss', '../../../helpers/custom-checkbox/custom-checkbox.scss']
})

export class KitchenRegisterComponent implements OnInit {

  public state: boolean = false;
  public kitchen: FormGroup;

  public success: boolean = false;
  public admin: any;
  public dropdownReadonly: boolean = true;

  @ViewChild('dropdown')
  public dropdown: DropdownComponent;
  protected codesForHandling: number[] = [422];


  constructor(public service: RegisterKitchenService,
              private toastService: ToastService,
              private accountProxy: AccountsProxy,
              private analytics: Analytics,
              private renderer: Renderer2,
              protected nearestLocation: NearestLocationService) {}

  public ngOnInit(): void {
    this.buildForm();
  }

  setAccount = (name = '', id = null) => {
    this.kitchen.get(['accountParams', 'name']).setValue(name);
    this.kitchen.get(['accountParams', 'id']).setValue(id);
  };

  updateAccountList = () => {
    return this.accountProxy.getAll();
  };


  public close(): void {
    this.success = this.state = false;
    this.admin = null;
    this.kitchen.reset();
    this.renderer.removeClass(document.documentElement, 'absolute-overlay');
    this.renderer.removeStyle(document.querySelector('home-header'), 'z-index');
  }

  public open(): void {
    this.nearestLocation.get().subscribe((account: any) => {
      this.setAccount(account.name, account.id);
    });
    setTimeout(() => this.state = true, 100);
    if (this.renderer) {
      this.renderer.addClass(document.documentElement, 'absolute-overlay');
      this.renderer.setStyle(document.querySelector('home-header'), 'z-index', '-1');
    }
  }

  submitForm() {
    _.each(this.kitchen.controls, (c) => c.markAsTouched());
    this.kitchen.markAsDirty();
    if (this.kitchen.invalid) return;
    this.service.create(ObjectLoader.toSnakeCase(this.kitchen.value)).subscribe(
      (response) => {
        const data = response.json();
        let kitchen = data.kitchen;
        if (data['message']) this.toastService.warning(data.message);
        this.analytics.registerKitchen(kitchen);
        this.success = true;
        this.admin = data.admin;
      },
      (error) => {
        if (_.includes(this.codesForHandling, error.status)) {
          this.kitchen.setErrors(ObjectLoader.toCamelCase(error.json()));
        } else {
          this.toastService.error(error);
        }
      }
    );
  }

  onChange(option) {
    if (option.id) {
      this.dropdownReadonly = true;
      const account = option;
      this.setAccount(account.name, account.id);
    } else {
      this.dropdownReadonly = false;
      this.kitchen.get('accountParams').reset();
      this.dropdown.nativeElement.focus();
      this.dropdown.closeDropdown();
    }

  }

  onClear(): void {
    this.setAccount();
  }

  onTyping($event): void {
    this.kitchen.get(['accountParams', 'id']).setValue(null);
    this.kitchen.get(['accountParams', 'name']).setValue($event);
  }


  protected buildForm(): void {
    this.kitchen = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      headChefName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required, ValidationService.emailValidator])),
      accountParams: new FormGroup({
        name: new FormControl('', Validators.required),
        id: new FormControl()
      }),
      receiveEmail: new FormControl(''),
      agreeToc: new FormControl('', Validators.required),
      agreePp: new FormControl('', Validators.required),
    });
  }

}
