import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'catering-request',
  styleUrls: [ './catering-request.scss' ],
  templateUrl: './catering-request.html'
})
export class CateringRequestComponent {
  translateX = 0
  @Input() requests;
  @Input() isEmployee;
  @Output() onPopupShow = new EventEmitter();
  @Output() onAccept = new EventEmitter();
  @Output() onReject = new EventEmitter();

  viewDetails(orderId) {
    this.onPopupShow.next(orderId)
  }

  accept(request) {
    this.hideRequest(request);
    this.onAccept.next(request.order_id);
  }

  reject(request) {
    this.hideRequest(request);
    this.onReject.next(request.order_id);
  }

  requestsLeft() {
    return _.filter(this.requests, {new: true}).length
  }

  private hideRequest(request) {
    request.new = false;
    this.translateX += 100;
  }
}
