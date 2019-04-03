import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ObjectLoader, ToastService } from "app/services";
import { AdminCompaniesService, AdminKitchensService } from 'app/admin/services';

const COMPANY = 'Company';
const KITCHEN = 'Kitchen';

@Component({
  selector: 'send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent {
  id;
  form;
  private api: AdminCompaniesService | AdminKitchensService;
  show = false;
  showEmployees = false;
  private loaded = false;
  private allEmployees = false;
  message;
  employees = [];
  messages = [];
  owner = true;
  option = 0;
  allMessagesLoaded = false;


  public constructor(private toast: ToastService, private fb: FormBuilder) { }

  public ngOnInit() {
    this.buildForm();
  }

  public open(api, id, type = COMPANY) {
    this.api = api;
    this.id = id;
    this.initPopup();
    this.setOption(type);
    setTimeout(() => this.show = true, 50);
  }

  private setOption(type) {
    switch (type) {
      default:
        this.option = 0;
      case COMPANY:
        this.option = 0;
        break;
      case KITCHEN:
        this.option = 1;
        break;
    }
  }

  public close(event = null) {
    this.show = false;
  }

  private initPopup() {
    this.loaded = false;
    this.employees.length = 0;
    this.messages.length = 0;
    this.allMessagesLoaded = false;

    this.resetNewMessageForm();
    this.loadMessages();
  }

  private resetNewMessageForm() {
    this.setAllEmployees({ target: { checked: false } });
    this.message = null;
    this.owner = true;
    this.showEmployees = false;
    this.allEmployees = false;
    this.form.reset();
  }

  public submit() {
    if (this.form.invalid || !this.id) return;

    let params = ObjectLoader.toSnakeCase(this.form.value);
    params.owner = this.owner;
    params.employee_ids = _.reduce(this.employees, (result, e) => {
      if (e.checked) result.push(e.id);
      return result;
    }, []);
    params.all_employees = this.allEmployees && params.employee_ids.length > 0;

    this.api.sendMessage(this.id, params).subscribe(
      () => this.close(),
      (error) => this.toast.error(error)
    );
  }


  protected buildForm() {
    this.form = this.fb.group({
      message: ['', Validators.required]
    });
  }

  private loadEmployees() {
    if (this.loaded) return

    this.api.employees(this.id).subscribe(
      (data) => {
        this.employees = data;
        this.setAllEmployees({ target: { checked: true } });
      },
      (error) => this.toast.error(error)
    )
  }

  changeOwner(event) {
    this.owner = this.eventChecked(event);
  }

  changeShowEmployees(event) {
    let value = this.eventChecked(event);
    this.showEmployees = value;
    if (this.showEmployees) this.loadEmployees();
  }

  setAllEmployees(event) {
    let value = this.eventChecked(event);
    this.employees.forEach((e) => this.changeEmployee(e, event));
    this.allEmployees = value;
  }

  changeEmployee(employee, event) {
    let value = this.eventChecked(event);
    employee.checked = value;
    if (!value) this.allEmployees = false;
  }

  private eventChecked(event) {
    return _.get(event, 'target.checked', false);
  }

  private loadMessages() {
    this.messages = [];
    this.onMessagesScroll();
  }

  sendNewMessage() {
    this.resetNewMessageForm();
  }

  onMessagesScroll() {
    if (this.allMessagesLoaded) return;
    this.api.messages(this.id, this.messages.length).subscribe(
      (data) => {
        if (data.length == 0 ) {
          this.allMessagesLoaded = true;
          return;
        }
        this.messages = this.messages.concat(data);
      },
      (error) => this.toast.error(error)
    )
  }

  onMessageClick(item) {
    this.message = item;
  }
}
