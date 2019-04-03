import { Component, OnInit, Input } from '@angular/core';
import { Menu } from "../../shared";


@Component({
  selector: 'menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
  @Input() item;
  @Input() setMenu;
  @Input() selectedDay;
  dishItems = []
  constructor(private menu: Menu) { }

  ngOnChanges(changes) {
    if (changes.item) {
      if (changes.selectedDay.currentValue) {
        this.setDishItems(changes);
      } else {
        this.dishItems = changes.item.currentValue.dishes;
      }
    }
    if (!changes.item && changes.selectedDay.currentValue) {
      this.setDishItems(changes);
    }
    if (this.dishItems && !changes.selectedDay.currentValue) {
      this.dishItems = this.item.dishes;
    }
  }

  private setDishItems(changes) {
    let items = this.item.dishes[changes.selectedDay.currentValue.day() - 1];
    this.dishItems = items ? [items] : [];
  }

  openPopup(dishItem) {
    if (dishItem.passed) return;
    dishItem.showPopup = true;
  }

  onSelect(dishItem, dish) {
    this.menu.updateItem(dishItem, dish);
  }
}
