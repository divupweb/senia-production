import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'app/services';
import { CreditCard } from 'app/shared';
import { Settings } from '../services';
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'step1',
  templateUrl: './step1.component.html',
  styleUrls: ['step1.component.scss']
})
export class Step1Component {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private settings: Settings,
    private cc: CreditCard,
    private toast: ToastService,
    protected translate: TranslateService
  ) {}

  ngOnInit() {
    this.settings.load();
  }

  onAddCreditCard() {
    this.cc.openNets();
    this.subscribeToCard();
  }

  private subscribeToCard() {
    this.cc.ccEmitted$.subscribe(
      (creditCard) => {
        this.toast.success(this.translate.instant('TOAST.SUCCESS.CARD_SAVED'), 60000);
        this.nextStep();
      },
      (error) => this.toast.error(error)
    )
  }

  toNextStep() {
    this.router.navigate(['..', 'step2'], { relativeTo: this.route });
  }

  toUserArea() {
    this.router.navigate(['/user']);
  }

  forwardUser(user) {
    if (!!user && user.can_edit_orders) {
      this.toNextStep();
    } else {
      this.toUserArea();
    }
  }

  nextStep() {
    this.settings.save().subscribe(
      (data) => {
        this.forwardUser(data.user);
      }
    );
  }
}
