import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { MenuApiService } from 'app/kitchen/admin/menu/shared';
import { ParamsUrlParser, ToastService } from "app/services";
import { DishCategoriesApiService } from "app/kitchen/services";

@Component({
  selector: 'menu-footer',
  templateUrl: './menu-footer.component.html',
  styleUrls: ['./menu-footer.component.scss']
})
export class MenuFooterComponent {
  constructor(
    private menuApi: MenuApiService,
    public dishCategoriesApi: DishCategoriesApiService,
    private toast: ToastService,
    private translate: TranslateService) { }
  @Input() subscription;
  @Input() weekStart;
  @ViewChild('addCategory') private addCategory;
  printUrl;
  ngOnChanges() {
    if (!this.subscription || !this.weekStart) {
      this.printUrl = "";
      return
    }
    this.printUrl = this.menuApi.printUrl(this.subscription, this.weekStart, ParamsUrlParser.isEmployee());
  }

  addCategoryOpen() {
    let fn = this.dishCategoriesApi.create.bind(this.dishCategoriesApi);
    this.addCategory.open(fn);
  }

  onCategorySave(cat) {
    this.toast.success(this.translate.instant('TOAST.KITCHEN_ADMIN.SUCCESS.ADD_CATEGORY'));
  }
}
