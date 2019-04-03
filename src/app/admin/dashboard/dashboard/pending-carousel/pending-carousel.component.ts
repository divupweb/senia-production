import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ToastService} from "app/services";
import { AdminCompaniesService } from "app/admin/services";
import {AdminKitchensService, AdminPendingService} from "app/admin/services";

@Component({
  selector: 'pending-carousel',
  styleUrls: ['pending-carousel.scss'],
  templateUrl: 'pending-carousel.html'
})

export class PendingCarouselComponent implements OnInit {


  public expanded: boolean = false;

  public show: boolean = false;
  public pendingElements: any[] = [];
  public pendingNames: string[] = [];
  public config: any = {
    nextButton: '.button-next',
    prevButton: '.button-prev',
    slidesPerView: 'auto',
    spaceBetween: 20
  };
  public constructor(protected pendingKitchens: AdminKitchensService,
                     protected pendingCompanies: AdminCompaniesService,
                     protected pendingService: AdminPendingService,
                     protected toast: ToastService) {}

  public ngOnInit(): void {
    this.load();
  }

  public toggle(): void {
    this.expanded = !this.expanded;
  }

  public isUpdate(kitchen) {
    return !!kitchen.kitchen_update;
  }

  public onError($event): void {
    this.toast.error($event);
  }
  public onApprove(item: any): void {
    if (item['type'] == 'company') {
      this.pendingService.count.total_companies++;
    } else {
      this.pendingService.count.total_kitchens++;
    }
    this.onReject(item);
  }

  public onReject(item: any): void {
    if (item['type'] == 'company') {
      this.pendingService.count.companies--;
    } else {
      this.pendingService.count.kitchens--;
    }
    _.remove(this.pendingElements, item);
    this.preparePendingInfo();
  }


  protected load(): void {
    Observable.forkJoin([
      this.pendingCompanies.getPendingList({ all: true}),
      this.pendingKitchens.getPendingList({ all: true })])
      .subscribe((pending) => {
        this.pendingElements = _.each(pending[0], (e) => e['type'] = 'company');
        this.pendingElements.push(..._.each(pending[1]['items'], (e) => e['type'] = 'kitchen'));
        this.preparePendingInfo();
      }, (error) => this.toast.error(error));
  }

  protected preparePendingInfo(): void {
    this.show = this.pendingElements.length > 0;
    this.pendingNames = _.map(this.pendingElements, 'name');
  }
}
