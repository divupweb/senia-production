import {ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'

import {ToastService, ObjectLoader} from "app/services";
import { IngredientsApiService } from '../shared';
import { DishValidator } from "./dish-validator.service";

export class DishForm  implements OnInit{
  newDish = false;
  backLink = ['../..'];

  public categories: string[] = ['warm', 'cold'];

  @ViewChild('file')
  public file: ElementRef;

  dishComponents = [];
  showIngredients = false;
  newIngredient = {
    weight: 0,
    query: '',
    ingredient: null,
    edited: true
  };
  public form: FormGroup;
  priceRange = { min: 0, max: 200 };
  allergyIds = [];
  dish;
  descriptionLimit = 300;
  description = {
    left: this.descriptionLimit,
    word: 'characters'
  };
  showSlider = false;
  protected dishCategoriesService;

  private initDish() {
    this.dish = {
      weight: 0
    }
  }


  constructor(
    public service: IngredientsApiService,
    public toast: ToastService,
    public fb: FormBuilder,
    public zone: NgZone,
    public router: Router,
    public route: ActivatedRoute) {
    this.initDish();
    this.form = this.fb.group({
      active: true,
      name: ['', Validators.required],
      dishCategoryId: ['', Validators.required],
      description: [''],
      dishType: ['', Validators.required],
      price: [0, Validators.compose([Validators.required, DishValidator.priceRange(this.priceRange)])],
      nettoPercent: [20],
      dishImage: this.fb.group({
        _destroy: [''],
        file: [''],
        id: [''],
        displayUrl: ['']
      })
    });
  }
  public inputPriceChange() {
    this.showSlider = false;
    setTimeout(() => this.showSlider = true,  50);
  }

  public fileChange(event): void {
    let files = event.target.files || event.srcElement.files;
    this.loadPreview(files[0]);
  }

  public ngOnInit(): void {
    const dishImage = this.form.get(['dishImage']);
    dishImage.get(['file']).valueChanges.subscribe((value: any) => {
      dishImage.get('_destroy').setValue(!!_.isNull(value));
      dishImage.get('displayUrl').setValue(value);
    });
  }

  updateIngredientsList() {
    return (query) => this.service.autocomplete(encodeURIComponent(query));
  }

  onIngredientSelect(e) {
    this.newIngredient.query = e.name + ' '; // for update same query in dropdown input
    setTimeout(() => { this.newIngredient.query = e.name }, 50);

    this.newIngredient.ingredient = e;
  }

  onIngredientClear() {
    this.checkRemoveAllergies(this.newIngredient);
    this.updateDishNutrients();
  }

  private clearNewIngredient() {
    this.newIngredient.weight = 0;
    this.newIngredient.query = '';
    this.newIngredient.ingredient = null;
  }

  onIngredientWeightChange(item) {
    this.fillNutrients(item);
    this.updateDishNutrients();
  }

  addIngredient() {
    if (!this.newIngredient.ingredient) return;

    let item = _.find(this.dishComponents, { ingredient: this.newIngredient.ingredient });
    if (item && item._destroy != '1') {
      item.weight += this.newIngredient.weight;
    } else {
      item = {
        ingredient: this.newIngredient.ingredient,
        weight: this.newIngredient.weight
      };
      this.dishComponents.push(item);
      this.addAllergies(this.newIngredient.ingredient.allergy_ids);
    }
    this.fillNutrients(item);
    this.clearNewIngredient();
    this.updateDishNutrients();
  }

  removeIngredient(item) {
    item._destroy = '1';
    this.checkRemoveAllergies(item);
    this.updateDishNutrients();
  }

  private addAllergies(ids) {
    ids.forEach((i) => {
      if (this.allergyIds.indexOf(i) == -1) this.allergyIds.push(i);
    });
  }

  private checkRemoveAllergies(item) {
    if (!item.ingredient) return;
    let ids = item.ingredient.allergy_ids;
    if (!ids) return;
    let dishComponents = this.dishComponents;

    let inOtherIngredients = (index) => {
      return dishComponents.some((c) => {
        return c != item && c._destroy != '1' && c.ingredient.allergy_ids && c.ingredient.allergy_ids.indexOf(index) > -1;
      });
    };

    ids.forEach((i) => {
      let index = this.allergyIds.indexOf(i);
      if (index > -1 && !inOtherIngredients(i)) this.allergyIds.splice(index, 1);
    });
  }

  dishData() {
    let formData = _.omit(this.form.value, 'dishImage');
    let buildComponents = (dishComponents) => {
      let isDestroy = (e) => {
        return e.weight > 0 ? e._destroy : '1'
      };

      return dishComponents
        .filter((e) => !!e.ingredient)
        .map((e) => {
          return {
            id: e.id,
            ingredient_id: e.ingredient.id,
            weight: e.weight,
            _destroy: isDestroy(e)
          }
        })
    };

    let data = {
      dish_components_attributes: buildComponents(this.dishComponents),
      allergy_ids: this.allergyIds,
      dish_image_attributes: this.form.get('dishImage').value
    };

    return JSON.stringify(Object.assign(ObjectLoader.toSnakeCase(formData), data));
  }

  nutrientValue = (ingredient, nutrient, weight) => {
    return weight * ingredient[nutrient] / 100;
  };

  nutrients = ['kilocalories', 'protein', 'carbo', 'fat'];

  private updateDishNutrients() {
    this.dish.weight = 0;
    this.nutrients.forEach((e) => { this.dish[e] = 0 });
    this.dishComponents.forEach((e) => {
      if ((e._destroy == '1') || !e.ingredient) return;
      this.dish.weight += e.weight;
      this.nutrients.forEach((nutrient) => {
        let val = e[nutrient];
        if (!isNaN(val)) this.dish[nutrient] += val;
      });
    });
    this.nutrients.forEach((e) => { this.dish[e] = Math.round(this.dish[e] * 10) / 10 });
    this.dish.weight = Math.round(this.dish.weight);
    this.touchForm();
  }

  fillNutrients(item) {
    this.nutrients.forEach((nutrient) => {
      item[nutrient] = this.nutrientValue(item.ingredient, nutrient, item.weight);
      item[nutrient] = (Math.round(10 * item[nutrient]) / 10);
    });
  }

  goToList() {
    this.router.navigate(this.backLink, { relativeTo: this.route });
  }

  public onChangeCategory(value) {
    this.showSlider = false;
    this.setMinMaxPrice(0, 1);
    let category = _.find(this.dishCategoriesService.categories, { id: parseInt(value) });
    if (category) {
      this.setMinMaxPrice(category.min_price, category.max_price);
    }
    let price = this.form.controls.price.value;
    price = Math.max(this.priceRange.min, price);
    price = Math.min(this.priceRange.max, price);
    this.form.controls.price.setValue(price);

    this.form.controls.price.updateValueAndValidity();
    setTimeout(() => { this.showSlider = true }, 100);
  }

  private setMinMaxPrice(min, max) {
    this.priceRange.min = parseInt(min);
    this.priceRange.max = parseInt(max);
  }

  onDescriptionChange() {
    let value = this.form.controls.description.value;
    let length = value.length;
    this.description.left = this.descriptionLimit - length;
    this.description.word = this.description.left == 1 ? 'character' : 'characters';
  }

  onPriceChange(e) {
    if (this.form.controls.price.value != e) {
      this.form.controls.price.setValue(e);
    }
  }

  disabledAddButton() {
    return !this.newIngredient.ingredient
  }

  protected resetForm() {
    this.initDish();
    this.form.reset();
    this.dishComponents = [];
  }

  protected touchForm() {
    this.form.markAsDirty();
  }

  protected loadPreview(image: any): void {
    let reader = new FileReader();
    reader.onload = (e: any) => this.form.get(['dishImage', 'file']).setValue(e.target.result);
    reader.readAsDataURL(image);
  }
}
