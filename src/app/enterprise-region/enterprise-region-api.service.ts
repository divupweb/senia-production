import { Injectable } from '@angular/core';
import { ApiClientService, ObjectLoader } from "app/services";

@Injectable()
export class EnterpriseRegionApiService {
  constructor(public apiClient: ApiClientService) {}
  logoUrl;
  baseUrl(name) {
    return `/accounts/${name}/enterprise`;
  }

  get(name) {
    return this.apiClient.get(this.baseUrl(name)).map(ObjectLoader.json);
  }

  setLogoUrl(url) {
    this.logoUrl = url;
  }

  getLogoUrl() {
    return this.logoUrl;
  }
}
