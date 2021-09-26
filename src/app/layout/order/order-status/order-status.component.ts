import {Component, Input, OnInit} from '@angular/core';
import {faListAlt, faHourglass, faFilePdf, faThumbsUp, faCreditCard, faTruck, faCheckDouble, faRulerHorizontal} from '@fortawesome/free-solid-svg-icons';
import {OrderResponseModel} from '../../../shared/model/response/order-response.model';
import {OrderService} from '../order.service';


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

  constructor(private orderService: OrderService) {
    this.status = 0;
  }

  ngOnInit(): void {
    this.getState();
  }

  getState(): void {
    const status = this.orderService.getStatusByOrder(this.order);
    if (status) {
      this.status = status.id;
    }
  }
}
