import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {OrderService} from '../order.service';
import {Injectable} from '@angular/core';
import {OrderResponseModel} from '../../../shared/model/response/order-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailResolver implements Resolve<any> {

  constructor(private orderService: OrderService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OrderResponseModel> {
    const orderId = route.paramMap.get('orderId');
    return this.orderService.getOrderById(orderId);
  }

}

