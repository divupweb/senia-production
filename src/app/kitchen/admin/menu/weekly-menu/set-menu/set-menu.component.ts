import { Component, Input } from '@angular/core';
import { MenuWizard } from './menu-wizard';
import {
  DishesService,
  Menu
} from "../../shared";

@Component({
  selector: 'set-menu',
  styleUrls: ['set-menu.scss'],
  templateUrl: './set-menu.html'
})

export class SetMenuComponent {
  @Input() date;
  showPopup = false;
  search = "";
  searchColumn = ['dish.name'];
  weekDays = moment.weekdaysMin().slice(1, 6);
  wizard;
  constructor(
    private dishesService: DishesService,
    private menu: Menu) {}

  ngOnInit() {
    this.initPopup();
  }

  private initPopup() {
    this.search = "";
  }

  open(kdc = null) {
    this.initPopup();
    this.initWizard(kdc);
    setTimeout(() => { this.showPopup = true }, 50);
  }

  close(event) {
    this.showPopup = false;
  }

  initWizard(kdc = null) {
    this.wizard = new MenuWizard(this.menu, this.date, this.dishesService);
    this.wizard.setCategory(kdc);
    this.wizard.build();
    this.wizard.onClose.subscribe((r) => this.close(null));
  }
}
