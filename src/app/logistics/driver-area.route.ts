import { Error404Component } from '../errors';
import { DriverAreaComponent } from './driver-area.component';
import { DriverDashboardComponent } from './driver';

export const routes = [
  {
    path: '',
    component: DriverAreaComponent,
    children: [
      { path: '', component: DriverDashboardComponent },
      { path: '**', component: Error404Component }
    ]
  }
];
