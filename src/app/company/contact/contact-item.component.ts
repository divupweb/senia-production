import { Component, OnInit, ViewChild } from '@angular/core';
import {AuthService, ObjectLoader, ToastService} from "app/services";
import {FeedbackComponent} from "app/company/contact";

@Component({
  selector: 'contact-item',
  styleUrls: [ 'contact-item.scss' ],
  templateUrl: './contact-item.html'
})

export class ContactItemComponent implements OnInit {
  @ViewChild('popup') popup: FeedbackComponent;

  public contact: { name?: string, phone?: string, email?: string, displayUrl?: string } = {};

  public constructor(protected api: AuthService, protected toast: ToastService) {}

  public ngOnInit(): void {
    this.api.currentAdmin().subscribe(
      (admin: any) => this.contact = ObjectLoader.toCamelCase(admin),
      (error) => this.toast.error(error));
  }
}
