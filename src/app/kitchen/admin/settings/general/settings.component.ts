import { Component, ViewChild } from '@angular/core';
import { KitchenChefImagesApiService, KitchenSettingsApiService, KitchenImagesApiService, KitchenLogoChangedService } from 'app/kitchen/services';
import { ToastService, ParamsUrlParser, Uploadable} from "app/services";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Mixin } from "app/helpers";
import { FileUploader } from 'ng2-file-upload'
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'kitchen-settings',
  templateUrl: 'settings.html',
  styleUrls: ['settings.scss']
})
@Mixin([Uploadable])
export class KitchenSettingsComponent implements Uploadable {
  public initUploader: (uploader: string, url: string, onResponse: Function) => void;
  public logoUploader: FileUploader;
  public logoUploaderFile: boolean = false;
  public logoUploaderProgress: number = 0;

  public mobileImageUploader: FileUploader;
  public mobileImageFile: boolean = false;
  public mobileImageProgress: number = 0;

  public kitchen: any = {};
  public kitchenLogo: string;

  public subscriptions: any[];
  public kitchenUpdate: any;
  public fieldsForUpdate: string[] = [];
  public chefImageDisplayUrl: string;
  public settingForm: FormGroup;
  public isEmployee;

  protected kitchenSubscriptionAtrrs = {
    active: true,
    capacity: 0,
    kitchenDishCategoriesAttributes: null
  };

  public constructor(private service: KitchenSettingsApiService,
                     private chefService: KitchenChefImagesApiService,
                     private toast: ToastService,
                     private _imagesApi: KitchenImagesApiService,
                     private formBuilder: FormBuilder,
                     protected logoChangedService: KitchenLogoChangedService,
                     protected translate: TranslateService
  ) {
    this.logoChangedService.urlEmitted.subscribe((url) => this.kitchenLogo = url);
    this.initUploader('logoUploader', this._imagesApi.imageUrl(), (data) => this.fileUpload(data));
    this.initUploader('mobileImageUploader', this.chefService.uploadUrl(), (data) => this.chefFileUpload(data));
    this.isEmployee = ParamsUrlParser.isEmployee()
  }

  public ngOnInit(): void {
    this.service.get(this.isEmployee).subscribe(
      (response) => {
        let kitchen = response.kitchen;
        this.logoChangedService.emitDisplayUrl(kitchen.display_url);
        if (kitchen.kitchen_update) {
          this.kitchenUpdate = kitchen.kitchen_update.settings;
          this.fieldsForUpdate = _(this.kitchenUpdate).map((v: any, k: string) => {
            if (_.isArray(v)) {
              return _(k).split('_').dropRight().join('_');
            }
            return k;
          }).value();
        }
        this.initKitchen(kitchen);
        this.initSubscriptions(kitchen.kitchen_subscriptions);
        this.chefImageDisplayUrl = kitchen.chef_display_url;
        this.initForm();
      },
      (error) => this.toast.error(error)
    );
  }

  public submitForm(): void {
    this.service.create(this.kitchen, this.subscriptions, this.isEmployee).subscribe(
      (response) => {
        if (response.success) {
          this.toast.success(this.translate.instant('TOAST.SUCCESS.SETTINGS_UPDATED'));
        }
      },
      (error) => {
        this.toast.error(error);
      }
    );
  }

  public chefFileUpload(data): void {
    if (data.id) {
      this.toast.success(this.translate.instant('TOAST.SUCCESS.IMAGE_UPLOADED'));
      this.chefImageDisplayUrl = data.display_url;
      this.kitchen.chefImageId = data.id;
    } else {
      this.toast.error(data.errors);
    }
  }

  public deleteChefImage(): void {
    this.chefService.delete(this.kitchen.chefImageId).subscribe(
      () => {
        this.chefImageDisplayUrl = this.kitchen.chefImageId = null;
      },
      (error) => this.toast.error(error)
    )
  }

  fileUpload(data) {
    if (data.id) {
      this.toast.success(this.translate.instant('TOAST.SUCCESS.IMAGE_UPLOADED'));
      this.logoChangedService.emitDisplayUrl(data.display_url);
      this.kitchen.imageId = data.id;
    } else this.toast.error(data.errors);
  }

  deleteImage() {
    this._imagesApi.delete(this.kitchen.imageId).subscribe(
      () => {
        this.kitchen.imageId = null;
        this.logoChangedService.emitDisplayUrl(null);
      },
      (error) => this.toast.error(error)
    );
  }

  private initKitchen(kitchen) {
    this.kitchen = {
      id: kitchen.id,
      chefImageId: kitchen.chef_image_id,
      imageId: kitchen.image_id
    };

    let values = ['headChefName', 'description', 'numberOfEmployees', 'name', 'address', 'bankAccount', 'vatNumber'];
    values.forEach( (e) => {
      this.kitchen[e] = this.getValue(kitchen, this.kitchenUpdate, _.snakeCase(e))
    })
  }

  protected initSubscriptions(kitchenSubscriptions) {
    let kitchenSubscriptionsAttributes = _.get(this.kitchenUpdate, 'kitchen_subscriptions_attributes');

    this.subscriptions = ["Breakfast", "Lunch", "Dinner"].map((e) => {
      let subscription;
      let type = e + "KitchenSubscription";
      let ks: any = _.find(kitchenSubscriptions, { type });
      if (ks) {
        subscription = {
          type: ks.type,
          active: ks.active,
          capacity: ks.capacity,
          kitchenDishCategoriesAttributes: ks.kitchen_dish_categories,
          name: e
        };
      } else {
        subscription = _.merge({ type, name: e }, this.kitchenSubscriptionAtrrs);
      }

      let ksUpdate = _.find(kitchenSubscriptionsAttributes, { type });
      _.merge(subscription, _(ksUpdate).mapKeys((v: any, key: string) => _.camelCase(key))
        .pick('capacity', 'kitchen_dish_categories_attributes'));

      return subscription;
    }, this)
  }

  private getValue(source, update, name) {
    return (update && update.hasOwnProperty(name)) ? update[name] : source[name]
  }

  protected initForm(): void {
    this.settingForm = this.formBuilder.group({
      headChefName: new FormControl('', Validators.required),
      numberOfEmployees: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      bankAccount: new FormControl('', Validators.required),
      vatNumber: new FormControl('', Validators.required),
      subscriptions: this.formBuilder.array(
        _.map(this.subscriptions, (s) => {
          return this.formBuilder.group({
            capacity: new FormControl(s.capacity, Validators.required),
            active: new FormControl(s.active)
          });
        })
      )
    });
  }

}
