import { Error404Component } from '../errors';
import { LogisticsAreaComponent } from './logistics-area.component';
import {
  LogisticsDashboardMainComponent,
  LogisticsDashboardComponent
} from './dashboard';
import { LogisticsLocationsComponent } from './locations'
import { LogisticsDetailsComponent } from './bank_details'


export const routes = [
  {
    path: '',
    component: LogisticsAreaComponent,
    children: [
      {
        path: '',
        component: LogisticsDashboardMainComponent,
        children: [
          { path: '', component: LogisticsDashboardComponent },
          { path: 'details', component: LogisticsDetailsComponent },
          { path: 'locations/:subscription/:date', component: LogisticsLocationsComponent },
          { path: '**', component: Error404Component }
        ]
      }
    ]
  }
];
