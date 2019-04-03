import {
  MenuComponent
} from './menu.component';
import {
  WeeklyMenuComponent,
  SetMenuComponent,
  DishesPopupComponent,
  MenuItemComponent,
  MenuFooterComponent,
  AddDishPipe,
  CategoryImageComponent,
  SetMenuItemComponent
} from './weekly-menu';
import {
  DishesListComponent,
  DishItemComponent,
  SortDishesComponent
} from './dishes-list';
import {
  EditDishComponent,
  NewDishComponent,
  VotesPopupComponent
} from './dish-form';

export let components = [
  MenuComponent,
  WeeklyMenuComponent,
  DishesListComponent,
  DishItemComponent,
  SetMenuComponent,
  DishesPopupComponent,
  EditDishComponent,
  NewDishComponent,
  VotesPopupComponent,
  SortDishesComponent,
  MenuItemComponent,
  MenuFooterComponent,
  CategoryImageComponent,
  SetMenuItemComponent,
]

export let pipes = [
  AddDishPipe
]
