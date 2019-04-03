import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

import { IngredientsApiService } from './ingredients-api.service';
import { IngredientCategoriesApiService } from './ingredient-categories-api.service';

import { ToastService } from '../../services';

@Component({
  selector: 'ingredients',
  providers: [
    IngredientsApiService,
    IngredientCategoriesApiService
  ],
  styleUrls: ['ingredients.scss'],
  templateUrl:'./ingredients.html'
})

export class IngredientsComponent {
  categories = [];
  ingredients = [];
  allergies = [];

  selectedCategory: any;
  selectedAllergies = [];

  showIngredients = false;
  showPopup = false;
  popupIngredient = false;
  popupObj;

  uploader: FileUploader;
  uploadProgress = 0;
  uploadFile = false;

  constructor(public ingredientsApi: IngredientsApiService,
              public categoriesApi: IngredientCategoriesApiService,
              private toast: ToastService) {}

  ngOnInit() {
    this.initUploader();
    this.loadCategories();
    this.loadAllergies();
  }

  private loadCategories() {
    this.categoriesApi.get().subscribe(
      data => {
        this.categories = data;
        this.fillItemsAllergies(this.categories);
      },
      error => {
        this.toast.error(error);
      }
    )
  }

  private loadAllergies() {
    this.categoriesApi.allergies().subscribe(
      data => {
        this.allergies = data;
        this.fillItemsAllergies(this.categories);
        this.fillItemsAllergies(this.ingredients, true);
      },
      error => {
        this.toast.error(error);
      }
    )
  }

  private loadIngredients() {
    this.ingredients = [];
    this.ingredientsApi.index(this.selectedCategory.id).subscribe(
      data => {
        this.ingredients = data;
        this.fillItemsAllergies(this.ingredients, true);
        this.showIngredients = true;
      },
      error => {
        this.toast.error(error);
      }
    )
  }

  private reloadPage() {
    this.loadCategories();
    if (this.selectedCategory) {
      this.loadIngredients()
    };
  };

  private initUploader() {
    this.uploader = new FileUploader({ url: this.categoriesApi.uploadFileUrl() });
    var allowedTypes = ['xls', 'ods', 'xlsx'];
    this.uploader.setOptions({
      autoUpload: true,
      allowedFileType: allowedTypes
     });

    this.uploader.onProgressItem = (fileItem: any, progress: any) => {
      this.uploadProgress = progress;
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.uploadFile = false;
      this.uploadProgress = 0;
      var data = JSON.parse(response)
      if (data.success) {
        this.toast.info(data.message);
        this.reloadPage();
      }
    }
    this.uploader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
      this.uploadFile = false;
      this.uploadProgress = 0;
      this.toast.error(response);
    }

    this.uploader.onAfterAddingFile = (fileItem: any) => {
      this.uploadFile = true;
    };

    this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
      this.toast.warning('You are not allowed to upload files "' + item.type + '", allowed types: ' +  allowedTypes.join(', '));
    };

  }

  selectCategory(category) {
    if (this.selectedCategory == category) {
      this.ingredients = [];
      this.selectedCategory = null;
      this.showIngredients = false;
      return;
    }

    this.selectedCategory = category;
    this.loadIngredients();
  }

  private fillAllergies(ids, sort){
    var sortIds = (pattern, ids) => {
      var i = -1;
      var max = ids.length;
      return _.sortBy(ids, (e) => {
        i += 1;
        var pat_i = pattern.indexOf(e) + 1;
        return i + max * pat_i;
      });
    };

    if (!ids || ids.length == 0) return [];
    if (sort && this.selectedCategory) {
      ids = sortIds(this.selectedCategory.allergy_ids, ids);
    };

    return _.map(ids, (id) => {
      return _.find(this.allergies, { id: id})
    });
  }

  private fillItemAllergies(item, sort = false) {
    item.allergies = this.fillAllergies(item.allergy_ids, sort);
  }

  private fillItemsAllergies(items, sort = false){
    if (!items) return;
    items.forEach(i => this.fillItemAllergies(i, sort), this);
  }


  removeCategory(category) {
    category.hidden = true;
    this.categoriesApi.remove(category.id).subscribe(
      data => {
        this.toast.info('Category has been removed');
        _.remove(this.categories, { id: category.id });
      },
      error => {
        category.hidden = false;
        this.toast.error(error);
      }
    )
  }

  removeIngredient(ingredient) {
    ingredient.hidden = true;
    this.ingredientsApi.remove(ingredient.id).subscribe(
      data => {
        this.toast.info('Ingredient has been removed');
        _.remove(this.ingredients, { id: ingredient.id });
      },
      error => {
        ingredient.hidden = false;
        this.toast.error(error);
      }
    )
  }

  ingredientRemoveAllergy(ingredient, allergy) {
    this.ingredientsApi.remove_allergy(ingredient.id, allergy.id).subscribe(
      data => {
        this.toast.info('Allergy has been removed');
        ingredient.allergy_ids = data.allergy_ids;
        this.fillItemAllergies(ingredient);
      },
      error => {
        this.toast.error(error);
      }
    )
  }

  categoryRemoveAllergy(category, allergy) {
    this.categoriesApi.remove_allergy(category.id, allergy.id).subscribe(
      data => {
        this.toast.info('Allergy has been removed');
        category.allergy_ids = data.category.allergy_ids;
        this.fillItemAllergies(category);

        if (this.selectedCategory && this.selectedCategory.id == category.id) {
          this.ingredients = data.ingredients;
          this.fillItemsAllergies(this.ingredients, true);
        }
      },
      error => {
        this.toast.error(error);
      }
    )
  }

  ingredientAddAllergy(ingredient) {
    this.openPopup(ingredient, true);
  }

  categoryAddAllergy(category) {
    this.openPopup(category);
  }

  private openPopup(obj, ingredient = false) {
    this.selectedAllergies = [];
    this.popupObj = obj;
    this.popupIngredient = ingredient;

    if (ingredient) this.selectedAllergies = obj.allergy_ids.slice();
    setTimeout( () => {this.showPopup = true;}, 100);
  }

  onSave(ids) {
    if (this.popupIngredient) {
      this.saveIngredientAllergies(ids);
    } else {
      this.saveCategoryAllergies(ids);
    }
  }

  private saveIngredientAllergies(allergy_ids) {
    this.ingredientsApi.save(this.popupObj.id, allergy_ids).subscribe(
      data => {
        this.toast.info('Allergies have been saved');
        this.popupObj.allergy_ids = data.allergy_ids;

        var diff = _.difference(this.popupObj.allergy_ids, this.selectedCategory.allergy_ids);
        if (diff.length > 0) {
          diff.forEach(e => { this.selectedCategory.allergy_ids.unshift(e); });
          this.fillItemAllergies(this.selectedCategory);
        }
        this.fillItemAllergies(this.popupObj, true);
      },
      error => {
        this.toast.error(error);
      }
    )
  }

  private saveCategoryAllergies(allergy_ids) {
    this.categoriesApi.save(this.popupObj.id, allergy_ids).subscribe(
      data => {
        this.toast.info('Allergies have been saved');
        this.popupObj.allergy_ids = data.category.allergy_ids;
        this.fillItemAllergies(this.popupObj);

        if (this.selectedCategory && this.selectedCategory.id == this.popupObj.id) {
          this.ingredients = data.ingredients;
          this.fillItemsAllergies(this.ingredients, true);
        }
      },
      error => {
        this.toast.error(error);
      }
    )
  }

  cancelPopup() {
    this.showPopup = false;
  }
}
