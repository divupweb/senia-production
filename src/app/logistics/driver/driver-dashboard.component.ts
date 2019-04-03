import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DriverDashboardApiService } from './driver-dashboard-api.service'
import { GoogleMapsLoader } from '../../helpers';
import { ToastService, ParamsUrlParser, WindowRef, AuthService } from "../../services";
import { MapService } from '../shared/maps-service'
import {TranslateService} from "@ngx-translate/core";
const GREEN = '00FF00'
const RED   = 'FF0000'

@Component({
  selector: 'driver-dashboard',
  providers: [DriverDashboardApiService ],
  styleUrls: [ 'driver-dashboard.scss' ],
  templateUrl: './driver-dashboard.html',
  encapsulation: ViewEncapsulation.None
})

export class DriverDashboardComponent {
  public map;
  public polyline;
  public mapsApi;
  public infowindow;
  public dates = [];
  selectedDate;
  dateLabels = ['today', 'tomorrow', 'monday']
  subscriptions = ['Breakfast', 'Lunch', 'Dinner']
  points = [];
  locations = []
  directLocations = []
  toHubLocations = []
  fromHubLocations = []
  markers = []
  selectedSubscription = 'Lunch'
  navOpened = false
  adressesExpanded = true
  selectedLocation: any = {}
  showSelectedLocation = false
  statusForm: any;
  showIssuePopup = false
  isKitchen;
  currentLocation;
  window;
  selectedArea;

  constructor(private _service: DriverDashboardApiService,
              private toast: ToastService,
              private _formBuilder: FormBuilder,
              protected translate: TranslateService,
              public  auth: AuthService) {
    this.window = WindowRef.nativeWindow;
    this.statusForm = this._formBuilder.group({
      name: [''],
      message: ['']
    });
  }

  ngOnInit() {
    this.isKitchen = ParamsUrlParser.isKitchen();
    this.loadRouteData();
  }

  isCompleted(location, area = null) {
    return location.status == 'delivered' ||
           (location.is_kitchen && location.pickup) ||
           (location.hub && area == 'to_hub' && location.delivered) ||
           (location.hub && area == 'from_hub' && (location.delivered || location.pickup));
  }

  isFailed(location) {
    return (location.is_kitchen && location.failed) || location.status == 'failed'
  }

  showLocationsDetailsPopup(location, area) {
    this.selectedLocation = location
    this.selectedArea = area;
    this.showSelectedLocation = true
  }

  reportIssue(e) {
    e.preventDefault()
    this.showSelectedLocation = false
    this.showIssuePopup = true
  }

  submitLocationStatus(successStatus) {
    if (this.statusForm.valid) {
      this._service.update(this.selectedLocation,
                           this.statusForm.value,
                           successStatus,
                           _.lowerCase(this.selectedSubscription),
                           this.selectedArea,
                           this.isKitchen,
                           this.selectedDate).subscribe(
        (location) => {
          this.showSelectedLocation = false
          this.showIssuePopup = false
          this.statusForm.controls.name.setValue('');
          this.statusForm.controls.message.setValue('');
          let loc: any = _.find(this.locationsInArea(), {id: location.id})
          if (location.is_kitchen || location.hub) {
            loc.pickup = location.pickup
            loc.failed = location.failed
            if (location.hub) {
              loc.delivered = location.delivered
            }
          } else {
            loc.status = location.status
          }
          this.moveBottom(loc);
          this.toast.success(this.translate.instant('TOAST.SUCCESS.STATUS_UPDATED'))
        },
        (error) => { this.toast.error(this.translate.instant('TOAST.ERROR.STATUS_UPDATE_FAILED'))  }
      )
    }
  }

  private locationsInArea(area = null) {
    return this[_.camelCase(this.selectedArea || area) + 'Locations']
  }

  private moveBottom(location, section = null) {
    let area = section || this.locationsInArea();
    _.remove(area, (l) => l.id == location.id);
    let i = _.findIndex(area, (l) => this.isCompleted(l, this.selectedArea))
    i > 0 ? area.splice(i, 0, location) : area.push(location)
  }

  goBackToSuccess(e) {
    e.preventDefault()
    this.showIssuePopup = false
    this.showSelectedLocation = true
  }

  expandMap() {
    this.adressesExpanded = !this.adressesExpanded;
    if(!this.map && !this.adressesExpanded) {
      this.loadMap()
    }
  }

  selectSubscription(sub, date = null) {
    this.selectedSubscription = sub
    if (date) {
      this.selectedDate = date;
    }
    this.loadRouteData()
  }

  buildRouteHere(location) {
    if (!("geolocation" in navigator)) {
      this.toast.error(this.translate.instant('TOAST.ERROR.GEOLOCATION'))
      return;
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.expandMap();
        let currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude}
        // let currentLocation = {lat: 59.909286, lng: 10.740883}
        this._service.buildRoute(location, currentLocation, this.isKitchen, _.lowerCase(this.selectedSubscription)).subscribe(
          (response) => {
            this.map.setCenter(currentLocation);
            this.points = response;
            this.putPolyline();
            this.clearMarkers();
            this.createMarker([currentLocation.lat, currentLocation.lng],
                              this.translate.instant('LOGISTICS.POSITION'),
                              "",
                              MapService.hubIcon());
            this.putMarker(location);
          },
          (error) => this.toast.error(error)
        )
      },
      (error) => this.toast.error(error.message)
    )
  }

  private loadRouteData() {
    this._service.get(_.lowerCase(this.selectedSubscription), this.isKitchen, this.selectedDate).subscribe(
      (routeData) => {
        this.dates = routeData.dates;
        this.locations = _.flatten([routeData.direct.locations, routeData.to_hub.locations, routeData.from_hub.locations])
        this.directLocations = routeData.direct.locations;
        this.toHubLocations = routeData.to_hub.locations;
        this.fromHubLocations = routeData.from_hub.locations;
        _.each(['directLocations', 'toHubLocations', 'fromHubLocations'], (locationGroup) => {
          _.each(_.clone(this[locationGroup]), (l) => {
            let area = _.snakeCase(_.replace(locationGroup, 'Locations', ''));
            if (this.isCompleted(l, area )) {
              this.moveBottom(l, this[locationGroup]);
            }
          })
        })
      },
      (error) => { this.toast.error(this.translate.instant('TOAST.ERROR.REROUTE_FAILED')) }
    )
  }

  private loadMap() {
    GoogleMapsLoader.load().then((_mapsApi) => {
      this.mapsApi = _mapsApi;
      let mapProp = {
        center: {lat: 59.909286, lng: 10.740883}, // Food.farm HQ,
        zoom: 14,
        mapTypeId: _mapsApi.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: this.mapsApi.MapTypeControlStyle.HORIZONTAL_BAR,
            position: this.mapsApi.ControlPosition.TOP_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: this.mapsApi.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: this.mapsApi.ControlPosition.LEFT_TOP
        },
        fullscreenControl: true
      };
      this.map = new _mapsApi.Map(document.getElementById("gmap"), mapProp);
      this.infowindow = new this.mapsApi.InfoWindow({content: "loading"});
    });
  }

  private putPolyline() {
    if (this.polyline) {
      this.polyline.setMap(null)
    }
    this.polyline = new this.mapsApi.Polyline({
      path: this.points,
      strokeColor: '#84a5fa',
      strokeOpacity: 1.0,
      strokeWeight: 6,
      clickable: false,
      map: this.map
    });
  }

  private putMarkers(locations = null) {
    this.clearMarkers()
    _.each(this.locations, (location) => {
      this.putMarker(location);
    })
  }

  private putMarker(location) {
    if (location.hub) {
      this.createMarker(location.location_point, location.name, location.address, MapService.hubIcon())
    } else if (location.is_kitchen) {
      this.createMarker(location.location_point, location.name, location.address, MapService.kitchenIcon())
    } else {
      this.createMarker(location.company.location_point, location.company.name, location.company.address, MapService.companyIcon())
    }
  }

  private clearMarkers() {
    if (this.markers.length > 0) {
      _.each(this.markers, (marker) => {
        marker.setMap(null);
      })
      this.markers = []
    }
  }

  private createMarker(latlng, label, html, icon) {
    let contentString = '<div class="gmaps-infobox">' + label + '<br>' + html + '</div>';
    let marker = new this.mapsApi.Marker({
      position: { lat: latlng[0], lng: latlng[1]},
      map: this.map,
      draggable: false,
      icon: icon,
      zIndex: Math.round(latlng[0] * -100000) << 5
    });
    this.markers.push(marker)

    this.mapsApi.event.addListener(marker, 'click', () => {
      this.infowindow.setContent(contentString);
      this.infowindow.open(this.map, marker);
    });
  }

  // Deprecated
  reRoute() {
    let ids = _.compact(
                _.map(this.locations, (location: any) => {
                  if (!!location.is_kitchen) {
                    return (location.pickup || location.failed) ? null : 'k' + location.id
                  } else {
                    return _.includes(['delivered', 'failed'], location.status) ? null : location.id
                  }
                }))
    if (ids.length > 1) {
      this._service.reroute(ids, this.selectedSubscription, this.isKitchen).subscribe(
        (data) => {
          if (data.locations) this.locations = data.locations
          this.toast.success(this.translate.instant('TOAST.SUCCESS.ROUTE_CHANGED'))
        },
        (error) => { this.toast.error(this.translate.instant('TOAST.ERROR.REROUTE_FAILED')) }
      )
    } else {
      this.toast.error(this.translate.instant('TOAST.ERROR.NOT_ENOUGH_POINTS'))
    }
  }
}
