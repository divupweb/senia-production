import { Component, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder } from '@angular/forms';
import {Forms, ToastService} from "app/services";
import {
  DishesService,
  DishCategoriesService,
  IngredientsApiService
} from '../shared'
import { DishForm } from './dish-form';
import {Mixin} from "app/helpers";


@Component({
  selector: 'dish-form',
  styleUrls: ['dish-form.scss'],
  templateUrl: './dish-form.html'
})
@Mixin([Forms])
export class NewDishComponent extends DishForm implements Forms {
  public handleErrors: (response: any) => void;
  submitButtonLabel = 'KITCHENS.BUTTONS.SAVE_NEW_DISH';
  newDish = true;

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
    dishCategoriesService.load().subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.showSlider = true;
  }

  submit() {
    if (Forms.invalid(this.form)) return;
    this.dishesService.create(this.dishData()).subscribe(
      () => this.goToList(),
      (error: Response) => this.handleErrors(error.json())
    )
  }
}
