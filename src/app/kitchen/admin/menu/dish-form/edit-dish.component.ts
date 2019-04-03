import { Component, NgZone, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder } from '@angular/forms';
import { Response } from '@angular/http';
import {Forms, ToastService} from "app/services";
import {
  IngredientsApiService,
  DishesService,
  DishCategoriesService
} from '../shared'
import { DishForm } from './dish-form';
import {Mixin} from "app/helpers";

@Component({
  selector: 'dish-form',
  styleUrls: ['dish-form.scss'],
  templateUrl: './dish-form.html'
})
@Mixin([Forms])
export class EditDishComponent extends DishForm implements Forms {
  public handleErrors: (response: any) => void;
  submitButtonLabel = 'BUTTONS.SAVE_CHANGES';
  id;
  loaded = false;
  showPopup = false;
  @ViewChild('popup') popup;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private dishesService: DishesService,
    protected dishCategoriesService: DishCategoriesService,
    public ingredientsApi: IngredientsApiService,
    public fb: FormBuilder,
    public toast: ToastService,
    public zone: NgZone
  ) {
    super(ingredientsApi, toast, fb, zone, router, route);
    dishCategoriesService.load().subscribe(() => this.setPrice());
  }

  submit() {
    if (this.loaded == false || Forms.invalid(this.form)) return;
    this.dishesService.update(this.id, this.dishData()).subscribe(
      () => this.goToList(),
      (error: Response) => this.handleErrors(error.json())
    )
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.params.subscribe((params: any) => {
      this.id = params.id;
      this.loaded = false;
      this.loadDish();
    })
  }

  loadDish() {
    this.resetForm();
    this.dishesService.get(this.id).subscribe(
      (dish) => {
        this.dish = dish;

        dish.dishComponents.forEach((e) => {
          this.fillNutrients(e);
          this.dishComponents.push(e); // unshift
        });
        this.allergyIds = dish.allergyIds;
        this.form.patchValue(dish.toForm());

        this.onDescriptionChange();
        this.setPrice();
        this.showSlider = true;
        this.loaded = true;
      }
    );
  }

  setPrice() {
    if (this.form.value.dishCategoryId && !_.isEmpty(this.dishCategoriesService.categories)) {
      this.onChangeCategory(this.form.value.dishCategoryId);
    }
  }

  removeDish() {
    this.dishesService.deactivate(this.id).subscribe((dish) => this.goToList());
  }
}
