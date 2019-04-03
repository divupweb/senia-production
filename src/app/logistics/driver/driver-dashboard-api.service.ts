import { Injectable } from '@angular/core';
import { AppStateService, ApiClientService } from "../../services";

@Injectable()
export class DriverDashboardApiService {
  constructor(public apiClient: ApiClientService,  private appState: AppStateService) {}

  baseUrl(isKitchen) {
    if (!!isKitchen) return '/kitchens/' + this.appState.kitchenDriverUser() + '/drivers/shipments/'
    else return '/drivers/shipments/'
  }

  get(subscription, isKitchen, date = null) {
    let params = { subscription: subscription }
    if (date) {
      params['date'] = date;
    }
    return this.apiClient.get(this.baseUrl(isKitchen) + 'route', params).map((responseData) => responseData.json())
  }

  update(location, data, success, subscription, area, isKitchen, date) {
    let params = JSON.stringify({
      location_type: location.hub ? 'Hub' : (location.is_kitchen ? 'Kitchen' : 'Shipment'),
      success: success,
      message: data.message,
      receiver: data.name,
      subscription: subscription,
      area: area,
      date: date
    });
    return this.apiClient.put(this.baseUrl(isKitchen) + location.id, params).map((responseData) => responseData.json())
  }

  buildRoute(location, currentLocation, isKitchen, subscription) {
    let params = JSON.stringify({
      subscription: subscription,
      location_type: location.hub ? 'Hub' : (location.is_kitchen ? 'Kitchen' : 'Shipment'),
      lat: currentLocation.lat,
      lng: currentLocation.lng
    });
    let locationId =  _.split(location.id, ',', 1)[0]
    return this.apiClient.post(this.baseUrl(isKitchen) + locationId + '/directions', params).map((responseData) => responseData.json())
  }

  reroute(data, subscription, isKitchen) {
    let params = {
      order: data,
      subscription: _.lowerCase(subscription)
    }
    return this.apiClient.post(this.baseUrl(isKitchen) + 'reroute', JSON.stringify(params)).map((responseData) => responseData.json())
  }
}
