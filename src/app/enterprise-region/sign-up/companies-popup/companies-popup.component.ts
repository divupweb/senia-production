import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {AccountsApiService, ToastService} from "app/services";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'companies-popup',
  styleUrls: ['companies-popup.scss'],
  templateUrl: 'companies-popup.html'
})
export class CompaniesPopupComponent implements OnInit {

  public companies: any[] = [];

  public state: boolean = false;

  public search: string;

  @Output()
  public onSelect: EventEmitter<any> = new EventEmitter();

  public constructor(protected service: AccountsApiService,
                     protected route: ActivatedRoute,
                     protected toast: ToastService) {}

  public ngOnInit(): void {
    this.loadCompanies();
  }

  public show(): void {
    setTimeout(() => this.state = true, 50);
  }

  public close(): void {
    this.state = false;
  }

  public select(company: any): void {
    this.onSelect.emit(company);
  }

  protected loadCompanies(): void {
    this.service.getCompanies(this.route.snapshot.params['region'])
      .subscribe(
        (companies) => this.companies = companies,
        (error) => this.toast.error(error)
      )
  }
}
