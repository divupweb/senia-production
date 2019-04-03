import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { AppStateService, ApiClientService } from "../../services";

@Injectable()
export class LogisticsLocationsApiService {
  constructor(public apiClient: ApiClientService,  private appState: AppStateService) {}

  baseUrl(isKitchen, resource) {
    if (!!isKitchen) {
      if(this.appState.kitchenAdmin()) return `/kitchens/${this.appState.kitchenAdmin()}/admin/${resource}/`
      else return `/kitchens/${this.appState.kitchenLogisticsUser()}/logistics/${resource}/`
    } else {
      return `/logistics/${resource}/`
    }
  }

  get(subscription, isKitchen, date = null) {
    let params = date ? { date: date } : {}
    return this.apiClient.get(this.baseUrl(isKitchen, 'shipments') + _.lowerCase(subscription), params).map(responseData => responseData.json())
  }

  getDrivers(subscription, isKitchen, date = null){
    let params = date ? { date: date } : {}
    return this.apiClient.get(this.baseUrl(isKitchen, 'drivers') +  _.lowerCase(subscription), params).map(responseData => responseData.json())
  }

  getDriverRoute(driverId, subscription, date, isKitchen) {
    let params = {date: date, subscription: _.lowerCase(subscription)}
    return this.apiClient.get(this.baseUrl(isKitchen, 'drivers') + driverId + '/route', params).map(responseData => responseData.json())
  }

  private driverData(driverId, shipmentIds, subscription, date, hubId, direction, assign) {
    return JSON.stringify(
      { driver_id: driverId,
        shipment_ids: shipmentIds,
        date: date,
        subscription: _.lowerCase(subscription),
        hub_id: hubId,
        direction: direction,
        assign: assign
      }
    )
  }

  setShipments(driverId, shipmentIds, subscription, date, isKitchen, hubId, direction, assign) {
    return this.apiClient.
                post(this.baseUrl(isKitchen, 'shipments'),
                     this.driverData(driverId, shipmentIds, subscription, date, hubId, direction, assign)).
                map((response) => response.json())
  }
}
