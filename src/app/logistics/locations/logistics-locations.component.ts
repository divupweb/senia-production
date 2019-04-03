import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DragulaService } from "ng2-dragula/ng2-dragula";
import { LogisticsLocationsApiService } from './logistics-locations-api.service';
import { GoogleMapsLoader } from 'app/helpers';
import { ToastService, ParamsUrlParser, AppStateService, WindowRef } from "app/services";
import { MapService } from '../shared/maps-service'
import {TranslateService} from "@ngx-translate/core";
const DIRECT   = "direct";
const TO_HUB   = "to_hub";
const FROM_HUB = "from_hub";

@Component({
  selector: 'logistics-locations',
  providers: [LogisticsLocationsApiService, DragulaService ],
  styleUrls: [ 'logistics-locations.scss' ],
  templateUrl: './logistics-locations.html',
  encapsulation: ViewEncapsulation.None
})

export class LogisticsLocationsComponent {
  public map;
  public mapsApi;
  public infowindow;
  kitchenShipments = [];
  markers = [];
  selectedDriver = null;
  kitchens = [];
  shipments = [];
  drivers = [];
  selectedShipments = [];
  canManage = false;
  failedShipments = [];
  errorsCount = 0;
  showPopup = false;
  hubSelectOpen = false;
  failedShipment;
  polyline;
  window;
  isKitchen;
  hubs = [];
  currentHub;
  currentTab;
  tabs = [];
  popover;
  constructor(private _service: LogisticsLocationsApiService,
              private dragulaService: DragulaService,
              private toast: ToastService,
              public route: ActivatedRoute,
              protected translate: TranslateService,
              private state: AppStateService) {
                this.window = WindowRef.nativeWindow;
              }

  ngOnInit() {
    this.loadMap();
    this.isKitchen = ParamsUrlParser.isKitchen();
    this.tabs = this.isKitchen ? [DIRECT] : [DIRECT, TO_HUB, FROM_HUB];
    this.loadPageData();
    this.initDragula();
  }

  private loadPageData() {
    this._service.get(this.params['subscription'], this.isKitchen, this.params['date']).subscribe(
      (kitchenShipments) => {
        this.kitchenShipments = kitchenShipments.data
        this.canManage = kitchenShipments.can_manage
        this.kitchens = _.map(kitchenShipments.data, (kitchenShipment: any) => {
          return kitchenShipment.kitchen;
        })
        this.shipments = _.flatten(_.map(kitchenShipments.data, (kitchenShipment: any) => {
                                     return kitchenShipment.shipments;
                                   }))
        this.loadDrivers();
        if (!this.canManage) this.failedShipments = _.filter(this.shipments, {status: 'failed'})
        if (!this.isKitchen) {
          this.switchTab(DIRECT);
          this.hubs = kitchenShipments.hubs;
          this.currentHub = this.hubs[0];
        } else {
          this.buildShipments(DIRECT)
        }
      }
    )
  }

  selectHub(id) {
    this.hubSelectOpen = false;
    this.currentHub = _.find(this.hubs, { id: id });
  }

  switchTab(mode = null) {
    this.currentTab = mode;
    this.selectedDriver = null;
    this.buildShipments();
    this.putMarkers();
  }

  hideCompanies() {
    return this.currentTab == TO_HUB;
  }

  showKitchens() {
    return this.currentTab != FROM_HUB;
  }

  showHubSelect() {
    return this.hubs.length > 0 && _.includes([TO_HUB, FROM_HUB], this.currentTab);
  }

  showLineArrow() {
    return _.includes([DIRECT, null], this.currentTab);
  }

  selectDriver(driver) {
    this.selectedDriver = driver;
    this.currentTab = null;
    this.buildShipmentsForSelectedDriver();
    this.putMarkers();
  }

  openPopup(shipment) {
    if(shipment.status == 'failed') {
      this.failedShipment = shipment;
      setTimeout( () => {this.showPopup = true;}, 100);
    }
  }

  calculateRoute() {
    this._service.getDriverRoute(this.selectedDriver.id,
                                 this.params['subscription'],
                                 this.params['date'],
                                 this.isKitchen).subscribe(
      (response) => {
        this.putPolyline(response.points)
      }
    )
  }

  clearAssignments(parentId, direction, id = null, getKitchenShipments = false ) {
    this.togglePopover(id ? 'shipment' : 'kitchen', id || parentId);
    let shipmentIds;
    if (getKitchenShipments) { // one case only: driver's assignments at to hub section
      let shipments = _.find(this.kitchenShipments, (ks: any) => ks.kitchen.id == parentId).shipments;
      shipmentIds = _.map(shipments, 'id');
    } else {
      let kitchenShipments = _.find(this.selectedShipments, (o) => o.kitchen.id == parentId && o.direction == direction);
      shipmentIds = id ? [id] : _.map(kitchenShipments.shipments, 'id');
    }
    this._service.setShipments(_.get(this.selectedDriver, 'id'),
                               shipmentIds,
                               this.params['subscription'],
                               this.params['date'],
                               this.isKitchen,
                               null,
                               direction,
                               false).subscribe(
      (data) => {
        this.updateShipmentsAttrs(data.shipments)
        if (this.selectedDriver) {
          this.updateDriverAttrs(data.driver);
          this.buildShipmentsForSelectedDriver();
        } else {
          this.buildShipments();
        }
        this.toast.success(this.translate.instant('TOAST.SUCCESS.SHIPMENTS_ASSIGNED'))
      }
    )
  }

  private currentHubId() {
    return this.showHubSelect() ? _.get(this.currentHub, 'id') : null;
  }

  private assignDriverShipments(driverId) {
    let d = _.find(this.drivers, {id: _.parseInt(driverId)});
    let shipmentIds = _.flatten(_.map(_.flatten(d.shipments), (s: any) => s.groupIds && s.groupIds.length > 0 ? s.groupIds : s.id));
    d.shipments = [];
    this._service.setShipments(driverId,
                               shipmentIds,
                               this.params['subscription'],
                               this.params['date'],
                               this.isKitchen,
                               this.currentHubId(),
                               this.currentTab,
                               true).subscribe(
      (data) => {
        this.updateShipmentsAttrs(data.shipments)
        this.updateDriverAttrs(data.driver);
        this.selectedDriver ? this.buildShipmentsForSelectedDriver() : this.buildShipments();
        this.toast.success(this.translate.instant('TOAST.SUCCESS.SHIPMENTS_ASSIGNED'))
      },
      (error) => { this.toast.error(error); }
    )
  }

  private updateDriverAttrs(newDriver) {
    let oldDriver = _.find(this.drivers, {id: newDriver.id})
    oldDriver.shipment_ids = newDriver.shipment_ids
    oldDriver.from_hub_shipment_ids = newDriver.from_hub_shipment_ids
    oldDriver.to_hub_shipment_ids = newDriver.to_hub_shipment_ids
  }

  private updateShipmentsAttrs(shipments) {
    _.each(shipments, (s) => {
      let old = _.find(this.shipments, {id: s.id})
      old.hub_id = s.hub_id
      old.hub_driver_id = s.hub_driver_id
      old.driver_id = s.driver_id
    })
  }

  buildShipments(tab = null) {
    let selectedTab = tab || this.currentTab;
    this.selectedShipments =  _.compact(
      _.map(this.kitchenShipments, (ks) => {
        let shipments
        switch(selectedTab) {
          case DIRECT: {
            shipments = _.filter(ks.shipments, (s) => !(s.hub_id || s.driver_id) )
            break;
          }
          case TO_HUB: {
            shipments = _.filter(ks.shipments, (s) => !s.hub_driver_id)
            break;
          }
          case FROM_HUB: {
            shipments = _.filter(ks.shipments, (s) => !s.driver_id);
            break;
          }
          default: { // all assigned shipments
            shipments = _.filter(ks.shipments, (s) => {
              return (!s.hub_id && s.driver_id) || (s.hub_id && s.hub_driver_id && s.driver_id);
            })
            break;
          }
        }
        return shipments.length > 0 ? {kitchen: ks.kitchen, shipments: shipments, expanded: true} : null;
      })
    )
    if (selectedTab == FROM_HUB) {
      let ships = _.flatten(_.map(this.selectedShipments, (ks) => ks.shipments))
      this.selectedShipments = [
        { shipments: this.groupShipmentsByAddress(ships),
          expanded: true,
          kitchen: null
        }
      ];
    }
  }

  buildShipmentsForSelectedDriver() {
    this.driverDirectShipments();
    if (!this.isKitchen) {
      this.driverHubShipments('to_hub_shipment_ids');
      this.driverHubShipments('from_hub_shipment_ids');
    }
  }

  private driverDirectShipments() {
    let shipments = _.filter(this.shipments, (shipment) => _.includes(this.selectedDriver.shipment_ids, shipment.id))
    let groupedKitchenShipments = this.groupShipmentsByKitchen(shipments);
    this.selectedShipments =  _.map(_.keys(groupedKitchenShipments), (kitchenId) => {
      return {kitchen: _.find(this.kitchens, {id: _.parseInt(kitchenId)}), shipments: groupedKitchenShipments[kitchenId], expanded: true}
    })
  }

  private driverHubShipments(ids) {
    let direction = _.split(ids, '_', 1)[0];
    let shipments = _.filter(this.shipments, (sh) => sh.hub_id && _.includes(this.selectedDriver[ids], sh.id))
    let groupedHubShipments = _.groupBy(shipments, (s) => s.hub_id);
    _.each(groupedHubShipments, (shipmentz, hubId) => {
      let selectedShipment = { kitchen: _.find(this.hubs, {id: _.toInteger(hubId)}),
                               expanded: true,
                               direction: direction}
      if (direction == 'to') { // group shipments by kitchen and display kitchen name
        let grouped = this.groupShipmentsByKitchen(shipments);
        let kitchenz = _.map(_.keys(grouped), (kitchenId) => {
          let kitchen = _.find(this.kitchens, {id: _.parseInt(kitchenId)})
          kitchen.shipments_length = grouped[kitchenId].length
          return kitchen;
        });
        selectedShipment['kitchens'] = kitchenz // kitchens displayed only for driver's to hub section
        selectedShipment['shipments'] = shipments;
      } else if (direction == 'from') {
        selectedShipment['shipments'] = this.groupShipmentsByAddress(shipmentz);
      }
      this.selectedShipments.push(selectedShipment);
    })
  }

  private groupShipmentsByKitchen(shipments) {
    return _.groupBy(shipments, (shipment) => {
      let kitchenWithShipments = _.find(this.kitchenShipments, (ks: any) => {
        return _.includes(_.map(ks.shipments, 'id'), shipment.id)
      })
      return kitchenWithShipments.kitchen.id
    })
  }

  private groupShipmentsByAddress(shipments) {
    let grouped = _.groupBy(shipments, 'address');
    return _.map(_.values(grouped), (shipSameAddress) => {
      let first = shipSameAddress[0];
      if (shipSameAddress.length > 1) {
        first.groupIds = _.map(shipSameAddress, 'id')
      }
      return first;
    })
  }

  loadDrivers() {
    this._service.getDrivers(this.params['subscription'], this.isKitchen, this.params['date']).subscribe(
      (drivers) => {
        this.drivers = drivers
        if (!this.canManage) {
          _.each(this.drivers, (driver) => {
            driver.errorsCount = _.intersection(driver.shipment_ids, _.map(this.failedShipments, 'id')).length
            this.errorsCount = this.errorsCount + driver.errorsCount
          })
        }
      },
      (error) => this.toast.error(error)
    )
  }

  private loadMap() {
    GoogleMapsLoader.load().then((_mapsApi) => {
      this.mapsApi = _mapsApi;
      let account = this.state.get('account');
      let mapProp = {
        center: {lat: account.location_point[0], lng: account.location_point[1]},
        zoom: 11,
        mapTypeId: _mapsApi.MapTypeId.ROADMAP
      };
      this.map = new _mapsApi.Map(document.getElementById("gmap"), mapProp);
      this.infowindow = new this.mapsApi.InfoWindow({content: "loading"});
    });
  }

  putMarkers() {
    this.clearMarkers();
    _.each(this.selectedShipments, (kitchenShipment) => {
      if (this.currentTab != TO_HUB) {
        if (kitchenShipment.kitchens) { // for drivers with to hub shipments: displays kitchens to pickup
          _.each(kitchenShipment.kitchens, (kitchen, index) => {
            if (kitchen.location_point.length > 0) {
              this.createMarker(kitchen.location_point,
                                kitchen.name,
                                kitchen.address,
                                MapService.kitchenIcon())
            }
          })
        } else { // displays shipments (companies) deliver to
          _.each(kitchenShipment.shipments, (shipment, index) => {
            if (shipment.location_point.length > 0) {
              this.createMarker(shipment.location_point,
                                shipment.company,
                                shipment.address,
                                MapService.companyIcon())
            }
          })
        }
      }
      if (this.currentTab != FROM_HUB && kitchenShipment.kitchen.location_point.length > 0) { // initial pickup point hub or kitchen
        this.createMarker(kitchenShipment.kitchen.location_point,
                          kitchenShipment.kitchen.name,
                          kitchenShipment.hub ? this.translate.instant('LOGISTICS.HUB') : kitchenShipment.kitchen.address,
                          kitchenShipment.hub ? MapService.hubIcon() : MapService.kitchenIcon())
      }
    })
    this.putMarkersForHubs();
  }

  createMarker(latlng, label, html, icon) {
    let contentString = '<div class="gmaps-infobox">' + label + '<br>' + html + '</div>';
    if (this.mapsApi) {
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
  }

  putMarkersForHubs() {
    if (_.includes([TO_HUB, FROM_HUB], this.currentTab)) {
      _.each(this.hubs, (hub) => {
        this.createMarker(hub.location_point, this.translate.instant('LOGISTICS.HUB'), hub.name, MapService.hubIcon())
      })
    }
  }

  putPolyline(points) {
    if(this.polyline) this.clearPolyline()
    this.polyline = new this.mapsApi.Polyline({
      path: points,
      strokeColor: '#84a5fa',
      strokeOpacity: 1.0,
      strokeWeight: 6,
      clickable: false,
      map: this.map
    });
  }

  clearPolyline() {
    this.polyline.setMap(null)
  }

  clearMarkers() {
    _.each(this.markers, (m) => {
      m.setMap(null);
    })
  }

  private currentParams;
  private get params() {
    if (!this.currentParams) {
      let params = this.route.snapshot.params;
      this.currentParams = _.pick(params, ['subscription', 'date']);
    }
    return this.currentParams;
  }

  isArray(items) {
    return _.isArray(items);
  }

  togglePopover(type, id) {
    let str =  _.join([type, id], '_');
    this.popover = this.popover && this.popover == str ? null : str
  }

  closePopover(event = null) {
    this.popover = null;
  }

  shipmentDriversInitials(shipment) {
    let driver = _.find(this.drivers, {id: shipment.driver_id})
    let hubDriver = _.find(this.drivers, {id: shipment.hub_driver_id})
    return _.compact(_.map([hubDriver, driver], (d) => {
      return d ? this.initials(d) : null;
    }))
  }

  initials(driver) {
    return _.map(_.words(driver.name), (name) => name[0]).join('');
  }

  private initDragula() {
    this.dragulaService.setOptions('shipments', {
      copy: false,
      moves: (el, cont, targ) => {
        return this.currentTab && !this.selectedDriver && el.className != 'item-i'
      }
    });

    this.dragulaService.dropModel.subscribe((event) => {
      const driverIndex = 2;
      this.assignDriverShipments(event[driverIndex].getAttribute('data-id'))
    });
    this.dragulaService.out.subscribe((value) => {
      let removeClass = (str, cls) => {
        let classes = str.split(' ');

        for (let i = 0; i < classes.length; i++) {
          if (classes[i] == cls) {
            classes.splice(i, 1);
            i--;
          }
        }
        return classes.join(' ');
      };
      value[2].className = removeClass(value[2].className, "wombat");
    });

    this.dragulaService.over.subscribe((value) => {
      if ( value[2].className.indexOf("wombat") == -1 ) {
        value[2].className += " wombat";
      }
    });
  }
}
