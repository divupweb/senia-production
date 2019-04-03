import { Component } from '@angular/core';
import {SuperAdminRegionsService} from "app/super-admin/services";
import {SuperAdminAccountImagesService} from "./super-admin-account-images.service";

@Component({
  selector: 'super-admin-regions',
  providers: [SuperAdminRegionsService, SuperAdminAccountImagesService],
  templateUrl:'./super-admin-regions.html'
})

export class SuperAdminRegionsComponent {}
