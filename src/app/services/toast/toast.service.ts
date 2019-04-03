import { Injectable } from '@angular/core';
import {
  ToastyService,
  ToastOptions
} from 'ng2-toasty'
import { Parser } from './parser'

@Injectable()
export class ToastService {
  constructor(private toastyService: ToastyService) { }

  private toastOptions(msg, timeout) {
    let toastOptions: ToastOptions =  {
      title: '',
      showClose: true,
      timeout: timeout || 5000,
      theme: 'default',
      msg: Parser.parse(msg)
    };
    return toastOptions;
  };

  public info(msg, timeout = null) {
    this.toastyService.info(this.toastOptions(msg, timeout));
  }

  public success(msg, timeout = null) {
    this.toastyService.success(this.toastOptions(msg, timeout));
  }

  public error(msg, timeout = null) {
    this.toastyService.error(this.toastOptions(msg, timeout));
  }

  public warning(msg, timeout = null) {
    this.toastyService.warning(this.toastOptions(msg, timeout));
  }

  public message(msg) {
    return Parser.parse(msg);
  }
}
