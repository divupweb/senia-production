import { Error404Component } from '../errors';
import { UserAreaComponent } from './user-area.component';
import { UserMenuComponent } from './menu';
import { WeeklyMenuComponent } from "./weekly-menu/";
import { PeriodicOrdersModule } from "./periodic-orders";

export const routes = [
  {
    path: '',
    component: UserAreaComponent,
    children: [
      { path: 'menu', component: UserMenuComponent },
      { path: 'weekly-menu', component: WeeklyMenuComponent},
      ...PeriodicOrdersModule.routes,
      { path: '**', component: Error404Component },
    ]
  },

];
