import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Pagination} from '../../shared/model/pagination';
import {OrderResponseModel} from '../../shared/model/response/order-response.model';
import {map} from 'rxjs/operators';
import {OrderStatusModel} from '../../shared/model/order-status.model';
import {OrderDetail} from "../../shared/model/order-detail.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl: string;
  orderStatusState: OrderStatusModel[];

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
    this.orderStatusState = [
      new OrderStatusModel(0, 100, 100, 'Tất cả'),
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

  getOrder(page: number, limit: number, keySearch: string, status: string, isAcept: string ): Observable<any> {
    const url = this.baseUrl + '/api/exportstore/getExportStoreSearch';
    const headers = new HttpHeaders().append('page', page.toString()).append('limit', limit.toString());
    const params = new HttpParams()
      .set('typeExportID', '1')
      .set('keySearch', keySearch)
      .set('status', status)
      .set('isAccept', isAcept);
    return this.http.get(url, {headers, params});
  }

  getOrderById(orderId: string): Observable<OrderResponseModel> {
    const url = this.baseUrl + '/api/exportstore/getViewExportStoreByExportID/' + orderId;
    return this.http.get(url).pipe(
      map((data: any) => Object.assign(new OrderResponseModel(), data.data))
    );
  }

  updateOrder(order: OrderResponseModel): Observable<OrderResponseModel> {
    const url = this.baseUrl + '/api/exportstore/update';
    return this.http.post(url, order).pipe(
      map((data: any) => Object.assign(new OrderResponseModel(), data.data))
    );
  }

  updateOrderStatus(ExportID: number, StatusID: number, IsAccept: number): Observable<any> {
    const url = this.baseUrl + '/api/exportstore/statusid/update';
    const data = {
      ExportID: ExportID,
      StatusID: StatusID,
      IsAccept: IsAccept
    };
    return this.http.post(url, data);
  }

  updateProductDetail(orderDetail: OrderDetail): Observable<any> {
    const url = this.baseUrl + '/api/exportstore/updateExportdetail';
    return this.http.post(url, orderDetail);
  }

  getStatusByOrder(order: OrderResponseModel): OrderStatusModel {
    if (order) {
      const state = this.orderStatusState.find(item => item.isAccept === order.IsAccept && item.statusId === order.StatusID);
      if (state) {
        return state;
      }
    }
    return null;
  }

  getStatusByStatusId(idStatus: number): OrderStatusModel {
    const result = this.orderStatusState.find(item => idStatus === item.id);
    return result;
  }

  getListStatusModal(): OrderStatusModel[] {
    return this.orderStatusState;
  }
}
