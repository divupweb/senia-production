import {
    Component,
    ViewChild,
    Input,
    SimpleChange,
    Output,
    EventEmitter, Renderer2
} from '@angular/core';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {DecisionMakerApiService} from './decision-maker-api.service';
import {ValidationService, ToastService} from 'app/services';
import { TranslateService } from "@ngx-translate/core";
import { ModalDirective } from 'ng2-bootstrap';

@Component({
  selector: 'decision-maker',
  templateUrl: './decision-maker.html',
  styleUrls: ['./decision-maker.scss']
})

export class DecisionMakerComponent {
  public decisionForm: FormGroup;
  @ViewChild('modalDec') public modal: ModalDirective;
  constructor(private _formBuilder: FormBuilder,
              public service: DecisionMakerApiService,
              private toast: ToastService,
              private translate: TranslateService,
              private renderer: Renderer2,
              private router: Router) {
                this.buildForm();
                this.service.update.subscribe((data) => this.switchState(data));
  }

  switchState(data) {
    if (this.modal.isShown !== data) this.modal.toggle();
  }

  onShow() {
    if (this.renderer) {
      this.renderer.setStyle(document.querySelector('home-header'), 'z-index', '-1');
    }
  }

  onHide() {
    this.service.close();
    this.renderer.removeStyle(document.querySelector('home-header'), 'z-index');
  }

  buildForm() {
    this.decisionForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', Validators.compose([Validators.required, ValidationService.emailValidator])]
    });
  }

  onSubmit() {
    this.decisionForm.markAsTouched();
    if (!this.decisionForm.valid) return;
    let formData = this.decisionForm.value;
    this.service.post(formData).subscribe(
      (data) => {
        this.toast.info(this.translate.instant('HOME.CONTACT_FORM.SUCCESS'))
        this.buildForm();
        this.onHide();
      },
      (error) => this.toast.error(error)
    );
  }
}
