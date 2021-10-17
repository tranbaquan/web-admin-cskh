import { Component, OnInit } from '@angular/core';
import {Pagination} from '../../shared/model/pagination';
import {OrderResponseModel} from '../../shared/model/response/order-response.model';
import {OrderService} from './order.service';
import {faSearch, faSortDown, faEllipsisH, faSpinner, faTimesCircle, faWindowClose, faSave, faClone} from '@fortawesome/free-solid-svg-icons';
import {OrderStatusModel} from '../../shared/model/order-status.model';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ModalService} from '../../shared/component/modal/modal.service';

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
  status: number;
  isAccept: number;
  listOrder: OrderResponseModel[];
  pagination: Pagination<OrderResponseModel>;
  orderStatusState: OrderStatusModel[];
  selectedOrder: OrderResponseModel;

  faSearch = faSearch;
  faSortDown = faSortDown;
  faEllipsisH = faEllipsisH;
  faSpinner = faSpinner;
  faTimesCircle = faTimesCircle;
  faSave = faSave;
  faWindowClose = faWindowClose;
  faClone = faClone;

  constructor(private orderSerVice: OrderService,
              private router: Router,
              private modalService: ModalService) {
    this.isLoading = false;
    this.page = 1;
    this.size = 20;
    this.keySearch = '';
    this.status = 100;
    this.isAccept = 100;
    this.pagination = new Pagination<OrderResponseModel>();

    this.orderStatusState = [
      new OrderStatusModel(0, 100, 100, 'Đặt hàng'),
      new OrderStatusModel(1, 0, 2, 'Chờ báo giá'),
      new OrderStatusModel(2, 0, 3, 'Đã báo giá'),
      new OrderStatusModel(3, 0, 0, 'Chờ phê duyệt'),
      new OrderStatusModel(4, 0, 1, 'Đã phê duyệt'),
      new OrderStatusModel(5, 0, 1, 'Chờ thanh toán'),
      new OrderStatusModel(6, 1, 1, 'Đã thanh toán'),
      new OrderStatusModel(7, 3, 1, 'Đang vận chuyển'),
      new OrderStatusModel(8, 4, 1, 'Hoàn tất'),
      new OrderStatusModel(9, -1, 100, 'Hủy'),
      new OrderStatusModel(10, 100, -1, 'Hủy phê duyệt')
    ];
  }

  ngOnInit(): void {
    this.searchOrder();
  }

  searchOrder(): void {
    this.orderSerVice.getOrder(this.page, this.size, this.keySearch, this.status.toString(), this.isAccept.toString())
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(data => {
        const pagination = new Pagination<OrderResponseModel>();
        pagination.totalItem = data.data.totals;
        pagination.page = this.page;
        pagination.size = this.size;
        pagination.totalPage = Math.ceil(data.data.totals / this.size);
        pagination.data = data.data.data.map(obj => Object.assign(new OrderResponseModel(), obj));
        this.pagination = pagination;
        this.listOrder = pagination.data;
      });
  }

  search(): void {
    this.searchOrder();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.searchOrder();
  }

  sort(statusId: number): void {
    const statusModel = this.orderStatusState.find(item => item.id === statusId);
    this.status = statusModel.statusId;
    this.isAccept = statusModel.isAccept;
    this.listOrder = [];
    this.page = 1;
    this.isLoading = true;
    this.searchOrder();
  }

  getStatusLabel(order: OrderResponseModel): string {
    if (order) {
      const state = this.orderStatusState.find(item => item.isAccept === order.IsAccept && item.statusId === order.StatusID);
      if (state) {
        return state.label;
      }
    }
    return '';
  }

  gotoDetail(orderId: number): void {
    this.router.navigate(['order', orderId]);
  }

  openStatusModal(order: OrderResponseModel): void {
    this.selectedOrder = order;
    this.modalService.open('status-modal');
  }

  closeModal(id: string): void {
    this.modalService.close(id);
  }
}
