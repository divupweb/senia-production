import {
  Component,
  Input,
  Output,
  EventEmitter, AfterViewInit
} from '@angular/core';
import { DishesService } from "../../shared";

@Component({
  selector: 'dishes-popup',
  styleUrls: ['dishes-popup.scss'],
  templateUrl: './dishes-popup.html'
})

export class DishesPopupComponent implements AfterViewInit {
  constructor(private dishesService: DishesService) {}
  private dishes = [];
  private initialized = false;
  search = "";
  @Input() showPopup = true;
  @Input() category;
  @Input() dish;
  @Output() showPopupChange = new EventEmitter();
  @Output() onDishSelect = new EventEmitter();

  ngOnChanges(changes) {
    if (changes.category) this.dishes = this.dishesService.byCategory(this.category);
  }

  ngAfterViewInit() {
    setTimeout(() => { this.initialized = true }, 50);
  }

  onSelect(dish) {
    if (this.dish && dish.id == this.dish.id) return;
    this.onDishSelect.emit(dish);
    this.close();
  }

  close(event = null) {
    if (!this.initialized) return;
    this.showPopup = false;
    this.showPopupChange.emit(false);
  }
}
