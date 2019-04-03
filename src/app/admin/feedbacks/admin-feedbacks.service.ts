import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';

@Injectable()
export class AdminFeedbacksService {
  constructor(public apiClient: ApiClientService) {}
  urlBase = '/admin/feedbacks/';

  public getList(params: {page: number, per_page: number}) {
    return this.apiClient.get(this.urlBase, params).map((res) => res.json())
  }

  updateSeen(ids) {
    return this.apiClient.post(this.urlBase, JSON.stringify({ids: ids})).map((res) => res.json())
  }
}
