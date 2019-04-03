import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { GoogleMapsLoader } from '../../helpers';

@Component({
  selector: 'failure-logistics-popup',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './failure-logistics-popup.html',
  styleUrls: ['failure-logistics-popup.scss'],
})

export class FailureLogisitsPopupComponent {
  public map;
  public mapsApi;
  public marker;
  showValue = false;
  @Input() shipment:any;
  @Input()
  get show() {
    return this.showValue;
  }
  set show(val) {
    this.showValue = val;
    this.showChange.emit(this.showValue);
    if (val){
      this.map ? this.putMarker() : this.loadMap()
    }

  }
  @Output() showChange = new EventEmitter();


  constructor() {}

  cancelPopup() {
    this.show = false;
  }

  private

  loadMap() {
    GoogleMapsLoader.load().then((_mapsApi) => {
      this.mapsApi = _mapsApi;
      let center =  { lat: this.shipment.location_point[0], lng: this.shipment.location_point[1]}
      let mapProp = {
        center: center,
        zoom: 15,
        mapTypeId: _mapsApi.MapTypeId.ROADMAP
      };
      this.map = new _mapsApi.Map(document.getElementById("gmap-failure"), mapProp);
      this.putMarker()
    });
  }

  putMarker() {
    if (this.marker) {
      this.marker.setMap(null);
      this.map.setCenter({ lat: this.shipment.location_point[0], lng: this.shipment.location_point[1]});
    }
    this.marker = new this.mapsApi.Marker({
      position: { lat: this.shipment.location_point[0], lng: this.shipment.location_point[1]},
      map: this.map,
      icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=A|ffff00",
      zIndex: Math.round(this.shipment.location_point[0] * -100000) << 5
    });
  }
}
