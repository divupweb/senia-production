import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from "rxjs";
import { ToastService } from '../../services';
import { KitchenSettingsApiService } from './settings-api.service';


@Injectable()
export class KitchenSettings {
  constructor(
    private settingsApi: KitchenSettingsApiService,
    private toast: ToastService) { }

  kitchen: any = {};
  dishCategories = [];
  private loader;
  private loaded = false;

  private toParams() {
    return {
      kitchen: this.kitchen,
      dishCategories: this.dishCategories
    }
  }

  load(opts: {} = {}) {
    let observer;
    if (this.loaded) {
      observer = Observable.from([this.toParams()]);
    } else {
      if (this.loader) {
        observer = this.loader;
      } else {
        observer = this.loadAll(opts['isEmployee']);
      }
    }
    return observer;
  }

  private loadAll(isEmployee = false) {
    this.loader = Observable.create((observer) => {
      this.settingsApi.get(isEmployee).subscribe(
        (response) => {
          this.kitchen = response.kitchen;
          this.dishCategories = response.dish_categories;
          this.loaded = true;
          this.loader = null;
          observer.next(this.toParams());
          observer.complete();
        },
        (error) => this.toast.error(error)
      );
    });

    return this.loader;
  }
}
