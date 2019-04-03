import {Injectable} from '@angular/core';
import {
  ApiClientService,
  AppStateService
} from 'app/services';


@Injectable()
export class SuspendApiService {
  constructor(public apiClient: ApiClientService,
              private appState: AppStateService) { }

  list(type, startDate) {
    return this.apiClient.get(this.baseUrl(type), { start_date: startDate }).map((r) => r.json())
  }

  create(type, startDate, endDate, options = null) {
    return this.apiClient.post(this.baseUrl(type), this.dates(startDate, endDate, options)).map((r) => r.json())
  }

  delete(type, startDate, endDate) {
    return this.apiClient.delete(this.baseUrl(type) + '?start_date=' + startDate + '&end_date=' + endDate).map((r) => r.json())
  }

  private baseUrl(type) {
    let url;
    if (type == 'kitchen') {
      url =  '/kitchens/' + this.appState.kitchenAdmin() + '/admin/suspends';
    } else if (type == 'general') {
      url = '/admin/suspends';
    } else {
      url = '/company/suspends';
    }

    return url;
  }

  private dates(startDate, endDate, options) {
    let params = {
      start_date: startDate,
      end_date: endDate
    };

    if (options) Object.assign(params, options);

    return JSON.stringify(params);
  }
}
