import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared';
import { SharedPipesModule } from '../../pipes';
import { SharedLocationsApiService } from './shared-locations-api.service'
import { SharedLocationsComponent } from './shared-locations.component'
import { IndexSharedLocationsComponent } from './index/'
import { FormSharedLocationsComponent } from './form/'

let routes = [
  { path: 'shared_locations', component: SharedLocationsComponent,
  children: [
    { path: '', component: IndexSharedLocationsComponent },
    { path: 'edit/:id', component: FormSharedLocationsComponent },
    { path: 'new', component: FormSharedLocationsComponent }
  ]
}]

@NgModule({
  imports: [
    CommonModule,
    SharedPipesModule.forRoot(),
    FormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    SharedLocationsComponent,
    IndexSharedLocationsComponent,
    FormSharedLocationsComponent
  ],
  providers: [ SharedLocationsApiService ]
})

export class SharedLocationsModule {
  static get routes() {
    return routes;
  }

  static forRoot() {
    return {
      ngModule: SharedLocationsModule
    };
  }
}
