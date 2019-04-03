import {Component, ViewChild} from '@angular/core';
import { UsersApiService } from "../../../services/";
import { ToastService } from "../../../../services/";
import { UserFormComponent } from "./form/";


@Component({
  selector: 'kitchen-users-list',
  styleUrls: ['users-list.scss'],
  templateUrl: 'users-list.html'
})

export class KitchenUsersListComponent {

  @ViewChild('form')
  public form: UserFormComponent;
  public kitchenUsers: any[];

  constructor(private service: UsersApiService,
              private toastService: ToastService) {}


  public ngOnInit(): void {
    this.service.getAll().subscribe((collection) => {
      this.kitchenUsers = collection;
    })
  }

  public removeUser(id): void {
    this.service.remove(id).subscribe(
      () => _.remove(this.kitchenUsers, { id }),
      (error) => this.toastService.error(error)
    )
  }

  public editUser(user: any): void {
    this.form.apply(user).show();
  }

  public newUser(): void {
    this.form.apply({}).show();
  }

  public onUserUpdate(user) {
    let u = _(this.kitchenUsers).find({ id: user.id });
    _.merge(u, user);
    this.form.close();
  }

  public onUserCreate(user) {
    this.kitchenUsers.push(user);
    this.form.close();
  }


}
