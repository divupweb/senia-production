import { Component } from '@angular/core';
import {
  DishesApiService,
  DishesService,
  DishCategoriesService,
  IngredientsApiService,
  MenuApiService,
  Menu
} from './shared';
import { UserMenuService } from 'app/shared/components/user-menu';
@Component({
  selector: 'kitchen-menu',
  styleUrls: ['menu.scss' ],
  templateUrl: './menu.html',
  providers: [
    DishesApiService,
    DishesService,
    DishCategoriesService,
    IngredientsApiService,
    MenuApiService,
    Menu,
  ]
})

export class MenuComponent {
  constructor(
    public userMenu: UserMenuService,
    public dishesService: DishesService) {
    this.load();
  }


  load() {
    this.dishesService.load().subscribe();
  }
}
