import {Component, EventEmitter, Input, Output} from "@angular/core";
import { AdminCompaniesService } from "app/admin/services";
import {ToastService} from "app/services";

@Component({
  selector: 'pending-company',
  templateUrl: 'pending-company.html',
  styleUrls: ['pending-company.scss']
})

export class PendingCompanyComponent {

  @Input()
  public company: any;

  @Input()
  public regions: any;

  @Output()
  public onApprove: EventEmitter<any> = new EventEmitter();

  @Output()
  public onReject: EventEmitter<any> = new EventEmitter();

  @Output()
  public onTransfer: EventEmitter<any> = new EventEmitter();

  public accountId;

  public constructor(protected service: AdminCompaniesService, protected toast: ToastService) {}

  public approveCompany(id): void {
    this.service.approveItem(id).subscribe(
      () => this.onApprove.emit(id),
      (error) => this.toast.error(error)
    )
  }

  public rejectCompany(id): void {
    this.service.rejectItem(id).subscribe(
      () => this.onReject.next(id),
      (error) => this.toast.error(error)
    )
  }

  public transfer(id): void {
    this.service.transfer(id, this.accountId).subscribe(
      () => this.onTransfer.next(id),
      (error) => this.toast.error(error)
    )
  }

}
