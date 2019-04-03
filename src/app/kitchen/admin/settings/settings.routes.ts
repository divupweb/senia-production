import {SettingsAreaComponent} from "./settings-area.component";
import {KitchenSettingsComponent} from "./general/";
import {DeadlinesComponent} from "./deadlines/";
import {SuspendPlannerComponent} from "./suspend-planner/";
import {KitchenUsersListComponent} from "./users/";
import {DishDiscountComponent} from './discounts'

export const routes = [
  { path: 'settings', component: SettingsAreaComponent,
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', component: KitchenSettingsComponent },
      { path: 'deadlines', component: DeadlinesComponent },
      { path: 'suspend-planner', component: SuspendPlannerComponent },
      { path: 'users', component: KitchenUsersListComponent },
      { path: 'discounts', component: DishDiscountComponent}
    ]
  },
];
