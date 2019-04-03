import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';

@Injectable()
export class ContactApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/company/feedbacks';

  create(body) {
    var data = JSON.stringify({ body: body });
    return this.apiClient.post(this.baseUrl, data).map(responseData => responseData.json())
  }
}
