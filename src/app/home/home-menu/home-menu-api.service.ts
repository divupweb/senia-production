import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';


@Injectable()
export class HomeMenuApiService {
  constructor(private api: ApiClientService) { }

  get(account_id, subscription, kitchen_id) {
    var params = {};
    if (account_id) params['account_id'] = account_id;
    if (subscription) params['subscription'] = subscription;
    if (kitchen_id) params['kitchen_id'] = kitchen_id;
    return this.api.get('/menu', params).map(i => i.json());
  }
}
