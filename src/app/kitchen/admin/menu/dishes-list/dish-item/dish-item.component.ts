import { Component, Input } from '@angular/core';
import { DishesService } from '../../shared'

@Component({
  selector: 'dish-item',
  styleUrls: ['dish-item.scss'],
  templateUrl: './dish-item.html'
})

export class DishItemComponent {
  @Input() dish;
  constructor(private dishesService: DishesService) {}

  changeActiveDishState(event) {
    if (this.dish.active) return;
    this.dishesService.activate(this.dish.id).subscribe();
  }
}
