import {Component, Input, OnInit} from '@angular/core';
import {OrderResponseModel} from '../../../shared/model/response/order-response.model';
import {ActivatedRoute} from '@angular/router';
import {faWindowClose, faFilePdf, faSave, faTrashAlt} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  order: OrderResponseModel;

  faWindowClose = faWindowClose;
  faFilePdf = faFilePdf;
  faTrashAlt = faTrashAlt;
  faSave = faSave;

  constructor(private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if (history.state.order) {
      this.order = history.state.order;
    } else {
      this.order = new OrderResponseModel();
    }
  }
}
