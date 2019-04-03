import { MenuComponent } from './menu.component';
import { WeeklyMenuComponent } from './weekly-menu';
import { EditDishComponent, NewDishComponent } from './dish-form';

export let menuRoutes = [{
  path: 'menu', component: MenuComponent,
  children: [
    { path: '', component: WeeklyMenuComponent },
    { path: 'dishes', redirectTo: '..', pathMatch: 'full' },
    { path: 'dishes/new', component: NewDishComponent },
    { path: 'dishes/:id', component: EditDishComponent },
  ]
}];
