import {AccountsProxy} from "app/services";
import {Injectable} from "@angular/core";

@Injectable()
export class MarketplaceOverviewService {

  public totalDishes: number = 0;
  public totalCities: number = 0;
  public totalKitchens: number = 0;

  public constructor(protected accountProxy: AccountsProxy) {
    this.accountProxy.getAll().subscribe((collection) => {
      _(collection).each((account) => {
        this.totalCities++;
        this.totalDishes += account.total_dishes;
        this.totalKitchens += account.total_kitchens;
      })
    })
  }
}
