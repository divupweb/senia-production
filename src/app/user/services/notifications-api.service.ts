import { Injectable } from '@angular/core';
import { ApiClientService } from 'app/services';

@Injectable()
export class NotificationsApiService {
  constructor(private apiClient: ApiClientService) { }

  baseUrl = '/user/notifications';

  get(id = null) {
    return this.apiClient.get(this.baseUrl, { id: id }).map((r) => r.json());
  }

  count() {
    return this.apiClient.get(`${this.baseUrl}/count`).map((r) => r.json());
  }

  markAsRead(ids) {
    let params = JSON.stringify({ ids: ids });
    return this.apiClient.post(this.baseUrl, params).map((r) => r.json());
  }
}
