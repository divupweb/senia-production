import { Component } from '@angular/core';
import { DishesService } from '../shared';

@Component({
  selector: 'dishes-list',
  styleUrls: ['dishes-list.scss'],
  templateUrl: './dishes-list.html'
})

export class DishesListComponent {
  constructor(public dishesData: DishesService) {}
  search = "";
  searchColumns = ['name'];
  sortParams = {
    columns: ['name'],
    order: ['asc']
  };

  ngOnInit() {
    this.loadDishes();
  }

  private loadDishes() {
    this.dishesData.sort = this.sortParams;
    this.dishesData.load().subscribe();
  }

  onSortSelect(id) {
    this.sortParams = id;
    this.dishesData.sort = this.sortParams;
  }
}
