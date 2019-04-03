import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'spinner',
  styleUrls: ['spinner.scss'],
  templateUrl: './spinner.html'
})

export class SpinnerComponent {
  MAX_VALUE = 100;
  MAX_TIME = 3;
  hidden = true;
  subscription: Subscription;

  value = 0;
  intervalID : any;


  constructor(private service: SpinnerService) {
    this.subscription = service.status$.subscribe(
      show => this.changeStatus(show)
    );
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.disableInterval();
  }


  private changeStatus(show) {
    this.hidden = !show;
    if (show) {
      this.startProgress()
    } else {
      this.disableInterval();
    }
  }

  private startProgress() {
    this.disableInterval();
    var maxTime = this.MAX_TIME;
    var maxValue = this.MAX_VALUE;
    var step = maxTime / maxValue;
    var factor = 70;

    var currentStep = 0;

    var changeProgress = ( ) => {
      var getValue = (x) => {
        return - (factor/(x + factor/maxValue) - maxValue);
      }

      currentStep += step;
      this.value = getValue(currentStep);
    }

    this.intervalID = setInterval(() => { changeProgress.call(this) }, step * 1000);
  }

  private disableInterval() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
      this.value = this.MAX_VALUE;
    };
  }
}
