import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { PaginationInstance } from 'ngx-pagination';
import { TranslateService } from "@ngx-translate/core";
import { ToastService } from "app/services";
import { CategoriesApiService } from './categories-api.service'

@Component({
  selector: 'kitchen-categories-list',
  styleUrls: ['categories-list.scss'],
  providers: [ CategoriesApiService ],
  templateUrl: './categories-list.html'
})

export class AdminKitchenCategoriesListComponent {
  categories = [];
  errorMessage: string;
  kitchenId;
  showPopup = false
  popupCategory;
  @Output() onCategoriesLoaded = new EventEmitter();
  @ViewChild('addCategory') addCategory;

  constructor(private _api: CategoriesApiService,
              private router: Router,
              private route: ActivatedRoute,
              private toastService: ToastService,
              protected translate: TranslateService) {
                this.kitchenId = this.route.snapshot.params.id;
              }

  ngOnInit() {
    this.load();
  }

  load() {
    this._api.getList(this.kitchenId).subscribe((categories) => {
      this.categories = categories;
      this.onCategoriesLoaded.next(categories)
    });
  }

  openCategory(category) {
    let fn;
    let api = (method) => this._api[method].bind(this._api);
    if (category) {
      fn = (params) => api('update')(category.id, this.kitchenId, params)
    } else {
      fn = (params) => api('create')(this.kitchenId, params);
    }
    this.addCategory.open(fn, category)
  }

  onCategorySave(cat) {
    this.toastService.success(this.translate.instant('TOAST.SUCCESS.CATEGORY_SAVED'))
    let category = _.find(this.categories, {id: cat.id})
    if (category) {
      Object.assign(category, cat)
    } else {
      this.categories.unshift(cat)
    }
    this.categories = this.categories.slice();
    this.onCategoriesLoaded.next(this.categories)
  }
}
