import {Component, Input, OnInit} from '@angular/core';
import {faListAlt, faHourglass, faFilePdf, faThumbsUp, faCreditCard, faTruck, faCheckDouble, faRulerHorizontal} from '@fortawesome/free-solid-svg-icons';
import {OrderResponseModel} from '../../../shared/model/response/order-response.model';


@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit {

  @Input() order: OrderResponseModel;

  status: number;

  faListAlt = faListAlt;
  faHourglass = faHourglass;
  faFilePdf = faFilePdf;
  faThumbsUp = faThumbsUp;
  faCreditCard = faCreditCard;
  faTruck = faTruck;
  faCheckDouble = faCheckDouble;
  faRulerHorizontal = faRulerHorizontal;

  constructor() {
    this.status = 0;
  }

  ngOnInit(): void {
    this.getState();
  }

  getState(): void {
    if (this.order) {
      if (this.order.StatusID === 0 && this.order.IsAccept === 2) {
        this.status = 1;
      }
      if (this.order.StatusID === 0 && this.order.IsAccept === 3) {
        this.status = 2;
      }
      if (this.order.StatusID === 0 && this.order.IsAccept === 1) {
        this.status = 3;
      }
      if (this.order.StatusID === 1 && this.order.IsAccept === 1) {
        this.status = 4;
      }
      if (this.order.StatusID === 3 && this.order.IsAccept === 1) {
        this.status = 5;
      }
      if (this.order.StatusID === 4 && this.order.IsAccept === 1) {
        this.status = 6;
      }
    }
    console.log(this.status);
  }
}
