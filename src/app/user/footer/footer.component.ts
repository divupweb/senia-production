import {Component, OnInit} from '@angular/core';
import {AuthService, ObjectLoader} from "app/services";

@Component({
  selector: 'user-footer',
  styleUrls: ['footer.scss'],
  templateUrl:'./footer.html'
})

export class UserFooterComponent implements OnInit {

  public contact: any = {};

  public constructor(protected api: AuthService) {}

  public ngOnInit(): void {
   this.api.currentAdmin().subscribe((admin) => this.contact = ObjectLoader.toCamelCase(admin));
  }
}
