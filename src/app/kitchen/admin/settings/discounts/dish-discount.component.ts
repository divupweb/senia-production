import { Component, Input, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastService } from "app/services";
import { TranslateService } from "@ngx-translate/core";
import { KitchenSettingsApiService } from 'app/kitchen/services/settings-api.service'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin'
const DISHES = 'dishes';
const CATEGORIES = 'categories';
@Component({
  selector: 'dish-discount',
  providers: [ KitchenSettingsApiService ],
  styleUrls: [ './dish-discount.scss' ],
  templateUrl: './dish-discount.html'
})


export class DishDiscountComponent {
  showPicker;
  discountForm;
  range = [];
  rangeLength;
  dishes = [];
  categories = [];
  dishIds = [];
  categoryIds = [];
  targetIds = 'dishIds';
  targetObj = 'dishes';
  type = DISHES;

  constructor(private service: KitchenSettingsApiService,
              private toast: ToastService,
              private formBuilder: FormBuilder,
              protected translate: TranslateService) {
                this.initForm();
                this.load();
              }

  load() {
    Observable.forkJoin([this.service.getKitchenDishesCategories(), this.service.getDiscount()]).subscribe(
      (data: any) => {
        this.dishes = data[0].dishes;
        this.categories = data[0].categories;
        let discount = data[1];
        this.range = discount.start_date && discount.end_date ? [moment(discount.start_date), moment(discount.end_date)] : []
        this.calcDiff();
        this.dishIds = discount.dish_ids || []
        this.categoryIds = discount.dish_category_ids || []
        this.discountForm.controls.percent.setValue(discount.percent)
        if (this.categoryIds.length > 0 && this.dishIds.length == 0) {
          this.setCategoriesType();
        }
      },
      (error) => this.toast.error(error)
    )
  }

  submit() {
    let range = _.map(this.range, (d) => d.format('YYYY-MM-DD'))
    let percent = this.discountForm.value.percent;
    this.service.saveDishDiscount(percent, range, this.dishIds, this.categoryIds, this.type).subscribe(
      (discount) => {
        this.toast.success(this.translate.instant('KITCHENS.SETTINGS.DISCOUNT_SAVED'))
      },
      (error)    => this.toast.error(error)
    )
  }

  setDishType() {
    this.type = DISHES;
    this.targetIds = 'dishIds';
    this.targetObj = 'dishes';
  }

  setCategoriesType() {
    this.type = CATEGORIES;
    this.targetIds = 'categoryIds';
    this.targetObj = 'categories';
  }

  switchType() {
    if (this.type == DISHES) {
      this.setCategoriesType();
    } else {
      this.setDishType();
    }
  }

  pickerChange(range) {
    this.range = range;
    this.calcDiff();
    this.showPicker = false;
  }

  openPicker() {
    if (!this.showPicker) {
      this.showPicker = true;
    }
  }

  formValid() {
    let percent = this.discountForm.controls.percent.value
    return this.range.length > 0 &&
           moment(this.range[0]) >= moment().startOf('day') &&
           percent > 0 &&
           ( this.categoryType() && this.categoryIds.length > 0 ||
             this.dishType() && this.dishIds.length > 0)
  }

  private calcDiff() {
    if (this.range.length > 1) {
      this.rangeLength = this.range[1].diff(this.range[0], 'days') + 1;
    }
  }

  toggleItem(id, e) {
    if (e.target.checked) {
      this[this.targetIds].push(id)
    } else {
      _.pull(this[this.targetIds], id)
    }
  }

  allItemsChecked() {
    return this[this.targetIds] && this[this.targetIds].length > 0 && this[this.targetIds].length == this[this.targetObj].length
  }

  checkAllItems(e) {
    if (e.target.checked) {
      this[this.targetIds] = _.map(this[this.targetObj], 'id');
    } else {
      this[this.targetIds] = [];
    }
  }

  itemChecked(id) {
    return _.includes(this[this.targetIds], id)
  }

  dishType() {
    return this.type == DISHES;
  }

  categoryType() {
    return this.type == CATEGORIES;
  }

  private initForm() {
    this.discountForm = this.formBuilder.group({
      percent:   [''],
    });
  }
}
