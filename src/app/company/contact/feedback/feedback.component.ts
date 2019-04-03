import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactApiService } from "../contact-api.service";
import { ToastService } from "../../../services";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'feedback',
  styleUrls: ['feedback.scss'],
  templateUrl: './feedback.html'
})
export class FeedbackComponent {
  feedbackForm: any;
  show = false;

  constructor(
    private contactApi: ContactApiService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    protected translate: TranslateService) {
    this.feedbackForm = this.formBuilder.group({ body: ['', Validators.required] });
  }

  send() {
    if (!this.feedbackForm.valid) return;

    this.contactApi.create(this.feedbackForm.value.body).subscribe(
      (response) => {
        const control = this.feedbackForm.controls.body;
        control.setValue('');
        control._touched = false;
        this.toast.success(this.translate.instant('TOAST.SUCCESS.FEEDBACK_SENT'));
        this.close();
      },
      (error) => {
        this.toast.error(error);
      }
    );
  }

  open() {
    setTimeout(() => {
      this.show = true;
    }, 100)
  }

  close() {
    this.show = false;
  }
}
