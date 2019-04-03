import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { AdminProfileApiService } from "../admin-profile-api.service";
import {Forms, ObjectLoader, ToastService, ValidationService} from 'app/services';
import {Observable} from "rxjs/Observable";
import {TranslateService} from "@ngx-translate/core";
import {UserStateService} from "app/user/services";
import {Mixin} from "app/helpers";

@Component({
  providers: [AdminProfileApiService],
  selector: 'admin-profile-edit',
  styleUrls: ['admin-profile-edit.scss'],
  templateUrl: './admin-profile-edit.html'
})
@Mixin([Forms])
export class AdminProfileEditComponent implements Forms, OnInit {
  public form: FormGroup;
  public handleErrors: (args) => void;

  @ViewChild('file')
  public file: ElementRef;

  public image: any;
  public imageDisplayUrl: string;

  protected user: any = {};

  public constructor(protected service: AdminProfileApiService,
                     public toast: ToastService,
                     protected formBuilder: FormBuilder,
                     protected t: TranslateService,
                     protected state: UserStateService
  ) {}

  public buildForm(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email:     ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      phone:     [''],
    });
  }

  deleteImage() {
    const subject: Observable<any> = this.user.displayUrl ? this.service.deleteImage(): Observable.from([true]);
    subject.subscribe(() => {
      this.image = this.imageDisplayUrl = this.file.nativeElement.value = this.user.displayUrl = null;
    }, (error) => this.toast.error(error))
  }

  fileChange(event) {
    let files = event.target.files || event.srcElement.files;
    this.image = files[0];
    this.loadPreview();
  }

  public ngOnInit(): void {
    this.buildForm();
    this.service.get().subscribe(
      (data) => {
        this.user = ObjectLoader.toCamelCase(data);
        this.form.patchValue(this.user);
        this.imageDisplayUrl = this.user.displayUrl;
      }, (error) => this.toast.error(error)
    )
  }

  public save(): void {
    if (Forms.invalid(this.form)) {
      return;
    }
    this.service.update(this.form.value, this.image).subscribe(
      (user) => {
        this.toast.success(this.t.instant('TOAST.SUCCESS.CHANGES_SAVED'));
        const currentUser = this.state.getUser();
        if (currentUser.id == user['id']) {
          this.state.setUser(_.merge(currentUser, user));
        }
      }, (error: Response) => this.handleErrors(error.json())
    );
  }

  protected loadPreview() {
    let reader = new FileReader();
    reader.onload = (e: any) => this.imageDisplayUrl = e.target.result;
    reader.readAsDataURL(this.image);
  }

}
