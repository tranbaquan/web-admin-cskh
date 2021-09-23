import { Component, OnInit } from '@angular/core';
import {Pagination} from '../../shared/model/pagination';
import {OrderResponseModel} from '../../shared/model/response/order-response.model';
import {OrderService} from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  isLoading: boolean;
  page: number;
  size: number;
  keySearch: string;
  status: string;
  isAccept: string;
  pagination: Pagination<OrderResponseModel>;

  constructor(private orderSerVice: OrderService) {
    this.isLoading = false;
    this.page = 1;
    this.size = 20;
    this.keySearch = '';
    this.status = '100';
    this.isAccept = '100';
    this.pagination = new Pagination<OrderResponseModel>();
  }

  ngOnInit(): void {
    this.searchOrder();
  }

  searchOrder(): void {
    this.orderSerVice.getOrder(this.page, this.size, this.keySearch, this.status, this.isAccept)
      .pipe()
      .subscribe(data => {
        const pagination = new Pagination<OrderResponseModel>();
        pagination.totalItem = data.data.totals;
        pagination.page = this.page;
        pagination.size = this.size;
        pagination.totalPage = Math.ceil(data.data.totals / this.size);
        pagination.data = data.data.data.map(obj => Object.assign(new OrderResponseModel(), obj));
        this.pagination = pagination;
      });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.searchOrder();
  }
}
