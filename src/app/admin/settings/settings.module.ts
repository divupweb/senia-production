import {NgModule} from "@angular/core";
import {AppCommonModule, ChangePasswordModule, SharedAdminModule, SharedModule, UserMenuModule} from "app/shared";
import {RouterModule} from "@angular/router";
import { AdminProfileEditComponent} from './profile';
import {UsersComponent, UsersFormComponent, UsersListComponent} from './users';
import {SettingsAreaComponent} from "./settings-area.component";
import {SuspendsModule} from "./suspends";



const routes = [
  { path: 'settings', component: SettingsAreaComponent,
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', component: AdminProfileEditComponent },
      ...SuspendsModule.routes,
      { path: 'users', component: UsersComponent,
        children: [
          { path: '', component: UsersListComponent,
            children: [
              { path: 'new', component: UsersFormComponent },
              { path: 'edit/:id', component: UsersFormComponent }
            ]
          },
        ]
      },
    ]
  }];

@NgModule({
  imports: [
    AppCommonModule,
    ChangePasswordModule,
    RouterModule,
    SharedModule,
    SharedAdminModule,
    SuspendsModule,
    UserMenuModule
  ],
  declarations: [
    AdminProfileEditComponent,
    UsersComponent,
    UsersFormComponent,
    UsersListComponent,
    SettingsAreaComponent
  ]
})
export class SettingsModule {
  static get routes() {
    return routes;
  }

  static forRoot() {
    return {
      ngModule: SettingsModule,
    };
  }
}
