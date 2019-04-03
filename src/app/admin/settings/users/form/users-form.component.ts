import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { UsersApiService } from '../users-api.service';
import {Forms, ObjectLoader, ToastService, ValidationService} from "app/services";
import { Router, ActivatedRoute } from '@angular/router'
import {Observable} from "rxjs/Observable";
import {Response} from "@angular/http";
import {UserStateService} from "app/user/services";
import {Mixin} from "app/helpers";


@Component({
  selector: 'users-form',
  providers: [ UsersApiService ],
  styleUrls: [ 'users-form.scss' ],
  templateUrl: 'users-form.html'
})

@Mixin([Forms])
export class UsersFormComponent implements Forms, OnInit {

  public form: FormGroup;

  @ViewChild('file')
  public file: ElementRef;

  public roles: string[] = ['admin', 'driver', 'logistics'];
  public image: any;
  public imageDisplayUrl: string;

  protected user: any = {};

  protected id: number;
  public handleErrors: (args) => void;

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected service: UsersApiService,
              protected formBuilder: FormBuilder,
              public toast: ToastService,
              protected state: UserStateService) {
    this.id = +this.route.snapshot.params['id'];
  }

  public buildForm(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email:     ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      password:  [''],
      role:      ['', Validators.required],
    });
  }

  public backToList(): void {
    this.router.navigate(['./'], { relativeTo: this.route.parent });
  }

  public deleteImage(): void {
    const subject: Observable<any> = this.user.displayUrl ? this.service.deleteImage(this.id): Observable.from([true]);
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
    if (this.id) {
      this.initUser(this.id);
    } else {
      this.form.get('password').setValidators(Validators.required);
    }
  }

  public submitForm(): void {
    _.each(this.form.controls, (c: FormControl) => c.markAsTouched());
    if (!this.form.valid) {
      return;
    }
    const payload = this.form.value;
    const subject: Observable<any> = this.id
      ? this.service.update(this.id, payload, this.image)
      : this.service.create(payload, this.image);
    subject.subscribe(
      (user) => {
        const currentUser = this.state.getUser();
        if (currentUser.id == user['id']) {
          this.state.setUser(_.merge(currentUser, user));
        }
        this.backToList()
      }, (error: Response) => this.handleErrors(error.json())
    );
  }


  protected initUser(id: number): void {
    this.service.get(id).subscribe(
      (user) => {
        this.user = ObjectLoader.toCamelCase(user);
        this.form.patchValue(this.user);
        this.imageDisplayUrl = this.user.displayUrl;
      }, (error) => this.toast.error(error)
    );
  }

  protected loadPreview() {
    let reader = new FileReader();
    reader.onload = (e: any) => this.imageDisplayUrl = e.target.result;
    reader.readAsDataURL(this.image);
  }

}
