import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import {
  MenuApiService,
  FavoriteKitchensService,
  Menu,
  MenuItemComponent,
  Kitchen
} from '../../../shared';
import { ToastService } from '../../../../services';


@Component({
  selector: 'kitchen-info-popup',
  templateUrl: './kitchen-info-popup.html',
  styleUrls: ['kitchen-info-popup.scss'],
  providers: [MenuApiService]
})

export class KitchenInfoPopupComponent {
  @Input() kitchen: Kitchen;
  @Input() activeDays;
  @Output() onClose = new EventEmitter;
  @Output() onAdd = new EventEmitter;
  showAdd = false;
  initialized = false;
  menu = [];

  constructor(
    public menuApi: MenuApiService,
    public favoriteKitchensApi: FavoriteKitchensService,
    public toast: ToastService,
    private el: ElementRef) { }

  ngOnInit() {
    this.loadMenu();
  }

  ngAfterViewInit() {
    setTimeout(() => this.initialized = true, 50); // skip the first 'open by click' handle
  }

  close(event) {
    if (!this.initialized) return;
    this.onClose.emit(false);
  }

  add() {
    this.showAdd = true;
  }

  onAddPopupSave(calendar) {
    let item = {
      kitchen: this.kitchen,
      calendar: calendar
    }
    this.onAdd.emit(item);
  }

  onAddPopupClose(e) {
    this.showAdd = false;
    this.setFocus();
  }

  setFocus() {
    let popup = this.el.nativeElement.firstElementChild;
    if (popup && popup.focus) popup.focus();
  }

  private loadMenu() {
    let date = moment().format();
    this.menuApi.menu('all', this.kitchen.id, date).subscribe(
      data => {
        this.menu = Menu.load(data);
      },
      error => this.toast.error(error)
    )
  }
}
